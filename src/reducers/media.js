import { MEDIA_REQUEST, MEDIA_RESPONSE } from "../actions/media";

export default function media(state = {}, action) {
    switch(action.type) {
        case MEDIA_REQUEST:
        return requestReducer(state, action);
        case MEDIA_RESPONSE:
        return responseReducer(state, action);
        default:
        return state;
    }
}

function requestReducer(state, action) {
    const {
        payload: {
            vars: {
                id,
                mediaType
            }
        } 
    } = action;
    const newState = { ...state };
    if(!newState[mediaType]) {
        newState[mediaType] = {}
    }
    newState[mediaType][id] = {
        isLoading: true
    };
    return newState;
}

function responseReducer(state, action) {
    const {
        meta: {
            id,
            mediaType
        },
        error,
        payload
    } = action;

    const newState = { ...state };
    if(error) {
        newState[mediaType][id] = {
            error,
            errorObject: payload
        }
    } else {
        const {
            Media: media
        } = payload;
        newState[mediaType][id] = {
            media
        }
    }
    return newState;
}