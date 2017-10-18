import { CALL_API } from '../middleware/api';

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
    return dispatch(fetchViewer());
}