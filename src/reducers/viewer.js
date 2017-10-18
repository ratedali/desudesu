import { VIEWER_REQUEST, VIEWER_RESPONSE } from '../actions/viewer';

export default token => (state = {}, action) => {
    switch(action.type) {
        case VIEWER_REQUEST:
        return requestReducer(state, action);
        case VIEWER_RESPONSE:
        return responseReducer(state, action, token);
        default:
        return state;
    }
}

function requestReducer(state, action) {
    return {
        isLoading: true
    };
}

const responseReducer = (state, action, token) => {
    const {
        error,
        payload
    } = action;
    return error ? {
        error,
        errorObject: payload
    } : {
        user: payload.Viewer,
        token: token
    };
}