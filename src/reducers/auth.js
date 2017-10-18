import { LOGIN } from '../actions/auth';
export default function auth(state = {}, action) {
    switch(action.type) {
        case LOGIN:
        return loginReducer(state, action);
        default:
        return state;
    }
}

function loginReducer(state, action) {
    const {
        payload: {
            token
        }
    } = action;
    return {
        token
    };
}