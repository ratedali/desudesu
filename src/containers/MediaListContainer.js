import { connect } from "react-redux";
import { withRouter } from "react-router";
import MediaList from "../components/MediaList";
import { mediaTypeFromMatchParam as getMediaType } from "../utils";

const mapStateToProps = (state, ownProps) => {
    const {
        match: {
            params: {
                username,
                mediaType: mediaTypeParam,
            }
        },
        listType,
        custom
     } = ownProps;
     const mediaType = getMediaType(mediaTypeParam);

    const sharedProps = {
        username,
        mediaType,
        listType
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
            [custom ? 'customLists' : 'lists']: lists
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

    if(!lists[listType]) {
        return sharedProps;
    }

    const {
        [listType]: list
    } = lists;

    if(!list) {
        return sharedProps;
    }

    return {
        ...sharedProps,
        list
    };
};

export default withRouter(connect(mapStateToProps)(MediaList));