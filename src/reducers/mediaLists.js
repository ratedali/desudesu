import { MEDIA_LISTS_REQUEST, MEDIA_LISTS_RESPONSE } from "../actions/list";

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
    return {
        isLoading: true,
    };
}

function responseReducer(state = {}, { error, payload }) {

    return {
        isLoading: false,
        error,
        [error ? "errorObject" : "response"]: payload
    };
}