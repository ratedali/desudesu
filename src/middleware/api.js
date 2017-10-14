import { Lokka } from "lokka";
import { Transport } from "lokka-transport-http";
import { PAGE_REQUEST, PAGE_RESPONSE } from '../actions/pageActions';

const client = new Lokka({
    transport: new Transport("https://graphql.anilist.co", {
        credentials: false
    })
});

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

    let { query, responseType } = callApi;
    let { vars } = action.payload;

    next(actionWithoutCall);

    let meta = {}
    if(action.type === PAGE_REQUEST && responseType === PAGE_RESPONSE) {
        meta = {
            contentType: action.payload.contentType,
            page: action.payload.vars.page
        }
    }

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