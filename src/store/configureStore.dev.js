import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { routerMiddleware } from 'react-router-redux';
import api from "../middleware/api";
import rootReducer from "../reducers";

const configureStore = (preloadedState, history) => {
    const enhancer = composeWithDevTools({realtime: true, port: 8000});
    const store = createStore(
        rootReducer,
        preloadedState,
        enhancer(
            applyMiddleware(
                createLogger(),
                thunk,
                routerMiddleware(history),
                api
            )
        )
    );

    if (module.hot) {
        module.hot.accept("../reducers", () => {
            const nextRootReducer = require("../reducers").default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};

export default configureStore;