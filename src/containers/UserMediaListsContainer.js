import { connect } from "react-redux";
import { withRouter } from "react-router";
import { loadMediaLists } from "../actions/lists";
import UserMediaLists from "../components/UserMediaLists";
import { mediaTypeFromMatchParam as getMediaType } from "../utils";

const mapStateToProps = (state, ownProps) => {
    const {
        match: {
            params: {
                username,
                mediaType: mediaTypeParam,
            }
        }
     } = ownProps;
     const mediaType = getMediaType(mediaTypeParam);

    const sharedProps = {
        username,
        mediaType
    }

    const userData = state.lists[username];

    if(!userData ||
        !userData[mediaType]) {
        return sharedProps;
    }

    const {
        [mediaType]: {
            isLoading,
            error,
            errorObject,
            lists,
            customLists
        }
    } = userData;

    if(isLoading) {
        return {
            ...sharedProps,
            isLoading
        }
    }

    if(error) {
        return {
            ...sharedProps,
            error: errorObject.message
        }
    }

    return {
        ...sharedProps,
        listTypes: Object.keys(lists),
        customListTypes: Object.keys(customLists),
    }
}

export default withRouter(connect(mapStateToProps, { loadMediaLists })(UserMediaLists));