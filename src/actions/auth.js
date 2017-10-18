import { loadViewer } from "./viewer"
import apiSpec from '../apiSpec';

export const LOGIN = Symbol("Login");
export const REFRESH_LOGIN = Symbol("Refresh Login");
export const tokenKey = "token";

const login = token => ({
    type: LOGIN,
    payload: {
        token
    }
});

export const registerToken = token => dispatch => {
    return (new Promise((resolve, reject) => {
        if(window.localStorage) {
            window.localStorage.setItem(tokenKey, token);
        } 
        resolve(token);
    }).then(token => {
        return dispatch(login(token));
    }).then(() => {
        return dispatch(loadViewer());
    }));
}

export const refreshLogin = () => dispatch => {
    return (new Promise((resolve, reject) => {
        if(window.localStorage) {
            const token = window.localStorage.getItem(tokenKey);
            resolve(token);
        } else {
            reject();
        }
    }).then(token => {
        return dispatch(login(token));
    }).then(() => {
        return dispatch(loadViewer())
    }));
}