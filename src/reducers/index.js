import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux'; 
import _ from 'lodash/fp';
import mediaLists from './mediaLists';
import pageData from './pages';
import auth from './auth';
import viewer from './viewer';

export default function rootReducer(state = {}, action) {
    return _.fromPairs(
        _.map(([key, reducer]) => [key, reducer(state[key], action)])(
            _.toPairs({
                mediaLists,
                pageData,
                auth,
                viewer: viewer(state.auth ? state.auth.token: undefined),
                router,
            })
        )
    );
}