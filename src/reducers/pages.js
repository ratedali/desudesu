import { PAGE_REQUEST, PAGE_RESPONSE, RESET_PAGE_DATA } from '../actions/pageActions';

export default function pageData(state = {}, action) {
    switch(action.type) {
        case PAGE_REQUEST:
        return requestReducer(state, action);
        case PAGE_RESPONSE:
        return responseReducer(state, action);
        case RESET_PAGE_DATA:
        return resetReducer(state, action);
        default:
        return state;
    }
}

function requestReducer(state, action) {
    let { 
        payload: { 
            contentType, 
            vars: { 
                page 
            } 
        } 
    } = action;
    let nextState = Object.assign({}, state);

    if (typeof nextState[contentType] === 'undefined') {
        nextState[contentType] = {
            pages: {}
        }
    }

    nextState[contentType].pages[page] = {
        isLoading: true
    }

    return nextState;
}

function responseReducer(state, action) {
    const {
        meta: {
            contentType,
            page
        },
        error,
        payload
    } = action;

    const nextState = Object.assign({}, state);

    nextState[contentType].lastPage = page;

    nextState[contentType].pages[page] = {
        isLoading: false,
        error,
        [error ? 'errorObject' : 'response'] : payload
    }
    return nextState;
}

function resetReducer(state, action) {
    const {
        payload: {
            contentType
        }
    } = action;

    const nextState = Object.assign({}, state);
    delete nextState[contentType];

    return nextState;
}