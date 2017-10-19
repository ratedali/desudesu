import React, { Component } from "react";
import PropTypes from "prop-types";

class MediaList extends Component {

    static propTypes = {
        username: PropTypes.string,
        mediaType: PropTypes.string.isRequired,
        listType: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        list: PropTypes.array,
        error: PropTypes.string,
        loadMediaLists: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.loadMediaLists({
            username: this.props.username,
            mediaType: this.props.mediaType,
            listType: this.props.listType,
        })
    }

    render() {
        const {
            list
        } = this.props;
        return ( list ?
            <ul>
                {
                    list.map(({mediaId, progress, score, status}) => (
                        <li key={mediaId}>
                            <p>id: {mediaId}</p>
                            <p>progress: {progress}</p>
                            <p>score: {score}</p>
                            <p>stats: {status}</p>
                        </li>
                    ))
                }
            </ul> : null
        );
    }
}

export default MediaList;