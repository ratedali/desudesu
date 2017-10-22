import { CALL_API } from '../middleware/api';
import { cacheViewer, loadViewerFromCache } from './caching'

export const VIEWER_REQUEST = Symbol("Viewer Request");
export const VIEWER_RESPONSE = Symbol("Viewer Response");

const fetchViewer = () => ({
    type: VIEWER_REQUEST,
    meta: {
        [CALL_API]: {
            query: 
            `query viewerQuery {
                Viewer {
                    id
                    name
                    avatar {
                        large
                        medium
                    }
                }
            }`,
            responseType: VIEWER_RESPONSE
        }
    }
});

export const loadViewer = () => (dispatch, getState) => {
    const viewer = getState().viewer;
    if(viewer && viewer.token === getState().auth.token) {
        return null;
    }
    return (
        loadViewerFromCache()
        .then(Viewer => {
            const payload = { Viewer };
            dispatch({
                type: VIEWER_RESPONSE,
                payload
            });
            return payload;
        })
        .catch(() => {
            return (
                dispatch(fetchViewer())
                .then(response => {
                    cacheViewer(response.Viewer);
                    return response;
                })
            );
        })
    );
}