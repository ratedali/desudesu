import { connect } from "react-redux";
import { loadMediaLists } from "../actions/listActions";
import MediaList from "../components/MediaList";

const mapStateToProps = (state, ownProps) => {
    const userName = ownProps.userName;
    const type = ownProps.type;
    const sharedProps = {
        userName, type
    }

    let { isLoading, error } = state['mediaLists'];
    
    if(isLoading) {
        return {
            ...sharedProps,
            isLoading
        }
    }

    if(error) {
        error = state['mediaLists'].errorObject.message
        return {
            ...sharedProps,
            error
        }
    }
    if(!state['mediaLists'].response) {
        return sharedProps;
    }

    const { response: { statusLists } } = state['mediaLists']
    const lists = Object.keys(statusLists).map(key => ({
        status: key,
        items: statusLists[key]
    }))
    return {
        ...sharedProps,
        lists
    };
};

export default connect(mapStateToProps, { loadMediaLists })(MediaList)