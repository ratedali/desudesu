import { connect } from "react-redux";
import { withRouter, matchPath } from "react-router";
import { push } from "react-router-redux";
import Nav from "../components/Nav";
import { refreshLogin } from "../actions/auth";

const mapStateToProps = (state, ownProps) => {
    const {
        location: {
            pathname: location
        }
    } = ownProps;
    const locationMatches = (path, exact = false) => Boolean(matchPath(location, {
        path,
        exact
    }))
    let currentSection = "unknown";
    if(locationMatches("/browse")) {
        currentSection = "browse";
    } else if (locationMatches("/list/:username/anime")) {
        currentSection = "anime";
    } else if (locationMatches("/list/:username/manga")) {
        currentSection = "manga";
    } else if (locationMatches("/", true)) {
        currentSection = "home";
    }

    const {
        auth: {
            token
        },
        viewer: {
            isLoading: userLoading,
            error: userError,
            user,
        }
    } = state;

    return {
        currentSection,
        loggedIn: Boolean(token),
        userLoading,
        userError,
        user
    };
};

const navigateTo = path => dispatch => {
    return dispatch(push({
        pathname: path
    }));
}

const searchFor = (mediaType, searchText) => dispatch => {
    return dispatch(push({
        pathname: `/browse/${mediaType.toLowerCase()}/search/${encodeURIComponent(searchText)}`,
    }));
}

export default withRouter(connect(mapStateToProps, { 
    navigateTo,
    searchFor,
    refreshLogin
 })(Nav));