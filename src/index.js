import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux';
import App from './components/App';
import configStore from "./store/configureStore";
import registerServiceWorker from './registerServiceWorker';
import { refreshLogin } from './actions/auth';

const history = createHistory();
const store = configStore({}, history);
store.dispatch(refreshLogin());

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
