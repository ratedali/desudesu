import { CALL_API } from "../middleware/api";

export const MEDIA_LISTS_REQUEST = Symbol("Media Lists Request");
export const MEDIA_LISTS_RESPONSE = Symbol("Media Lists Response");

const fetchMediaLists = (vars, listType) => ({
    type: MEDIA_LISTS_REQUEST,
    meta: {
        [CALL_API]: {
            query: 
            `query mediaListsQuery($username: String, $mediaType: MediaType, $format: ScoreFormat) {
                MediaListCollection(userName: $username, type: $mediaType) {
                    statusLists {
                        mediaId
                        progress
                        score
                        status
                    }
                    customLists {
                        mediaId
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
        vars,
        listType
    }
});

export const loadMediaLists = (vars, listType) => (dispatch, getState) => {
    const {
        mediaType,
        username
    } = vars;
    const userData = getState().lists[username];
    if(userData && userData[mediaType] && userData[mediaType].lists) {
        if(listType) {
            const {
                [mediaType]: {
                    lists: {
                        [listType]: list
                    }
                }
            } = userData;
            if(list) {
                return null;
            }
        } else {
            return null;
        }
    }
    return dispatch(fetchMediaLists(vars, listType));
}