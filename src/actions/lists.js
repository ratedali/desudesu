import { CALL_API } from "../middleware/api";
import { MEDIA_RESPONSE, mediaContent } from "./media"

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
    return dispatch(fetchMediaLists(vars)).then(response => {
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
        return Promise.all(actions.map(dispatch));
    });
}