import { connect } from "react-redux";
import { withRouter } from "react-router";
import { loadMedia } from '../actions/media';
import MediaListItem from '../components/MediaListItem';
import { mediaTypeFromMatchParam as getMediaType } from "../utils";

const mapStateToProps = (state, ownProps) => {
    const {
        match: {
            params: {
                mediaType: mediaTypeParam
            }
        },
        mediaInfo: {
            mediaId,
            progress,
            score,
            status
        }
    } = ownProps;

    const mediaType = getMediaType(mediaTypeParam);

    const sharedProps = {
        mediaId,
        mediaType,
        progress,
        score,
        status
    };

    const {
        media: {
            [mediaType]: {
                [mediaId]: {
                    isLoading,
                    error,
                    errorObject,
                    media
                } = {}
            } = {}
        }
    } = state;

    if(isLoading) {
        return {
            ...sharedProps,
            isLoading
        };
    }

    if(error) {
        return {
            ...sharedProps,
            error: errorObject.message,
        };
    }

    return {
        ...sharedProps,
        media
    };
}

export default withRouter(connect(mapStateToProps, { loadMedia })(MediaListItem));