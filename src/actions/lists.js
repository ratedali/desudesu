import { CALL_API } from "../middleware/api";
import { MEDIA_RESPONSE, mediaContent } from "./media"
import { loadListsFromCache, loadCustomListsFromCache } from './caching';
import { cacheLists, cacheCustomLists } from './caching';

export const MEDIA_LISTS_REQUEST = Symbol("Media Lists Request");
export const MEDIA_LISTS_RESPONSE = Symbol("Media Lists Response");

const fetchMediaLists = (vars) => ({
    type: MEDIA_LISTS_REQUEST,
    meta: {
        [CALL_API]: {
            query: 
            `query mediaListsQuery($username: String, $mediaType: MediaType, $format: ScoreFormat) {
                MediaListCollection(userName: $username, type: $mediaType) {
                    statusLists {
                        mediaId
                        media {
                            ${mediaContent}
                        }
                        progress
                        score
                        status
                    }
                    customLists {
                        mediaId
                        media {
                            ${mediaContent}
                        }
                        progress
                        score(format: $format)
                        status
                    }
                }
            }`,
            responseType: MEDIA_LISTS_RESPONSE
        }
    },
    payload: { 
        vars
    }
});

export const loadMediaLists = (vars) => (dispatch, getState) => {
    const {
        mediaType,
        username
    } = vars;
    const userData = getState().lists[username];
    if(userData && userData[mediaType] && userData[mediaType].lists) {
            return null;
    }

    let networkFinished = false;
    const network = (
        dispatch(fetchMediaLists(vars))
        .then(response => {
            const {
                MediaListCollection: {
                    statusLists,
                    customLists
                }
            } = response;
            const getMedia = lists => (
                Object.keys(lists).map(
                    key => lists[key]).reduce(
                        (list, current) => list.concat(current), []).map(
                            item => item.media));
            const statusMedia = getMedia(statusLists);
            const customMedia = getMedia(customLists);

            const actions = (
                statusMedia.concat(customMedia).map(
                    media => [media.type, media.id, {Media: media}]
                ).map(([mediaType, id, payload]) => ({
                    type: MEDIA_RESPONSE,
                    meta: {
                        mediaType,
                        id
                    },
                    payload
                }))
            );
            return Promise.all(actions.map(dispatch)).then(() => (response));
        })
        .then(data => {
            networkFinished = true;
            const lists = {
                ...data.MediaListCollection.statusLists
            };
            const customLists = {
                ...data.MediaListCollection.customLists
            };
            Object.keys(lists).forEach(key => {
                lists[key].forEach(item => {
                    delete item.media;
                });
            });
            Object.keys(customLists).forEach(key => {
                customLists[key].forEach(item => {
                    delete item.media
                });
            })
            cacheLists(lists);
            cacheCustomLists(customLists);
            return data;
        })
    );

    const listsCache = loadListsFromCache();
    const customListsCache = loadCustomListsFromCache();
    const cache = (
        Promise.all([listsCache, customListsCache])
        .then(() => listsCache)
        .then(lists => 
            customListsCache.then(custom => [lists, custom]))
        .then(([statusLists, customLists]) => {
            const payload = {
                MediaListCollection: {
                    statusLists,
                    customLists
                }
            };
            if(!networkFinished) {
                dispatch({
                    type: MEDIA_LISTS_RESPONSE,
                    meta: {
                        username,
                        mediaType
                    },
                    payload
                });
            }
            return payload;
        })
        .catch(() => Promise.resolve())
    );
    return Promise.all([network, cache]);
}