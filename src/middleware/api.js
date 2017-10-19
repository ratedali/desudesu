import { Lokka } from "lokka";
import { Transport } from "lokka-transport-http";
import { PAGE_REQUEST, PAGE_RESPONSE } from '../actions/page';
import { MEDIA_LISTS_REQUEST, MEDIA_LISTS_RESPONSE } from '../actions/lists';

export const CALL_API = Symbol("Call API");

export default store => next => action => {
    if(!action.meta) {
        return next(action);
    }
    const callApi = action.meta[CALL_API];
    if (typeof callApi === "undefined") {
        return next(action);
    }
    const actionWithoutCall = { ...action };
    delete actionWithoutCall.meta[CALL_API];


    next(actionWithoutCall);

    let { query, responseType } = callApi;
    let vars = action.payload ? action.payload.vars : {};
    let meta = {}
    if(action.type === PAGE_REQUEST && responseType === PAGE_RESPONSE) {
        meta = {
            contentType: action.payload.contentType,
            page: action.payload.vars.page
        }
    } if (action.type === MEDIA_LISTS_REQUEST && responseType === MEDIA_LISTS_RESPONSE) {
        meta = {
            username: action.payload.vars.username,
            mediaType: action.payload.vars.mediaType
        }
    }

    let headers = {};
    const {
        auth: {
            token
        }
    } = store.getState()
    if(token) {
        headers = {
            'Authorization': `Bearer ${token}`
        };
    }
    const client = new Lokka({
        transport: new Transport("https://graphql.anilist.co", {
            credentials: false,
            headers
        })
    });
    return client.query(query, vars).then(
        response => next({
            meta,
            type: responseType,
            payload: response
        }),
        error => next({
            meta,
            type: responseType,
            error: true,
            payload: error
        })
    );
}