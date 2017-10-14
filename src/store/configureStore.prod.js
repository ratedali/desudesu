import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from 'react-router-redux';
import api from "../middleware/api";
import rootReducer from "../reducers";

const configureStore = (preloadedState, history) => {
    const store = createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(thunk, api, routerMiddleware(history)));
    return store;
};

export default configureStore;