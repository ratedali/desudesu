import { connect } from "react-redux";
import { withRouter, matchPath } from "react-router";
import { push } from "react-router-redux";
import Nav from "../components/Nav";

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
    } else if (locationMatches("/list/anime")) {
        currentSection = "anime";
    } else if (locationMatches("/list/manga")) {
        currentSection = "manga";
    } else if (locationMatches("/", true)) {
        currentSection = "home";
    }
    return {
        currentSection
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
    searchFor
 })(Nav));