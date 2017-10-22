import { MEDIA_LISTS_REQUEST, MEDIA_LISTS_RESPONSE } from "../actions/lists";

export default function mediaList(state = {}, action) {
    switch(action.type) {
        case MEDIA_LISTS_REQUEST:
        return requestReducer(state, action);
        case MEDIA_LISTS_RESPONSE:
        return responseReducer(state, action);
        default:
        return state;

    }
}

function requestReducer(state = {}, action) {
    const {
        payload: {
            vars: {
                mediaType,
                username,
            },
        }
    } = action;

    const newState = {
        ...state
    };

    if(!newState[username]) {
        newState[username] = {};
    }

    newState[username][mediaType] = {
        isLoading: true
    };

    return newState;
}

function responseReducer(state = {}, action) {

    const {
        meta: {
            mediaType,
            username,
        },
        error,
        payload
    } = action;

    const newState = {
        ...state
    };

    if(error) {
        newState[username][mediaType] = {
            error,
            errorObject: payload
        }
    } else {
        const {
            MediaListCollection: {
                statusLists: lists,
                customLists
            }
        } = payload;
        Object.keys(lists).forEach(key => {
            lists[key].forEach(item => delete item.media);
        });
        Object.keys(customLists).forEach(key => {
            customLists[key].forEach(item => delete item.media);
        });
        newState[username][mediaType] = {
            lists,
            customLists
        }
    }
    return newState;
}