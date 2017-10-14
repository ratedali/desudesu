import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux'; 
import mediaLists from './mediaLists';
import pageData from './pages';

export default combineReducers({
    mediaLists,
    pageData,
    router,
});