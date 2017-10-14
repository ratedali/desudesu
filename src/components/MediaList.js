import React, { Component } from "react";
import PropTypes from "prop-types";

class MediaList extends Component {

    static propTypes = {
        userName: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        lists: PropTypes.array,
        error: PropTypes.string,
        loadMediaLists: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.loadMediaLists({
            userName: this.props.userName,
            type: this.props.type
        })
    }

    render() {
        if(this.props.error) {
            return (<p> Error: {this.props.error} </p>)
        }

        if(this.props.isLoading) {
            return (<p>Loading...</p>)
        }
        
        if(!this.props.lists) {
            return null;
        }

        return (
        <div>
            {this.props.lists.map(list => (
                <div key={list.status}>
                    <h1>{list.status}</h1>
                    {list.items.map(item => (
                        <li key={item.media.id}>
                            {item.media.title.romaji} - {item.score}
                        </li>
                    ))}
                </div>
            ))}
        </div>
        );
    }
}

export default MediaList;