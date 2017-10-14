import { CALL_API } from "../middleware/api";

export const MEDIA_LISTS_REQUEST = Symbol("Media Lists Request");
export const MEDIA_LISTS_RESPONSE = Symbol("Media Lists Response");

const fetchMediaLists = vars => ({
    type: MEDIA_LISTS_REQUEST,
    meta: {
        [CALL_API]: {
            query: 
            `query mediaListQuery($userId: Int, $userName: String,
                 $type: MediaType, $format: ScoreFormat) {
                     MediaListCollection(userId: $userId, userName: $userName, 
                        type: $type) {
                    user {
                        id
                        name
                    }
                    statusLists {
                        media {
                            id
                            title {
                                native
                                romaji
                                english
                            }
                        }
                        score(format: $format)
                    }
                }
            }`,
            responseType: MEDIA_LISTS_RESPONSE
        }
    },
    payload: { vars }
});

export const loadMediaLists = vars => (dispatch, getState) => {
    const response = getState().mediaLists.response;

    if(response && response.mediaLists) {
        return null;
    }

    return dispatch(fetchMediaLists(vars));
}