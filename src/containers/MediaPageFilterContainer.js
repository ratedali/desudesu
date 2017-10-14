import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import _ from 'lodash/fp';
import apiSpec from "../apiSpec";
import MediaPageFilter from '../components/MediaPageFilter';


const mapStateToProps = (state, ownProps) => {
    const {
        match: {
            params: {
                seasonYear,
                season,
                search,
                mediaType
            }
        }
    } = ownProps;
    const { seasons, mediaType: types } = apiSpec;
    return {
        mediaType: types[mediaType.toLowerCase()],
        seasonYear,
        season: season ? seasons[season] : season,
        search
    };
}

const filterChange = filter => dispatch => {
    const { seasonYear, season, search, mediaType } = (
        _.mapValues( value => value ? encodeURIComponent(value) : value)(filter)
    );


    if(typeof search !== 'undefined') {
        return dispatch(push({
            pathname: `/browse/${mediaType.toLowerCase()}/search/${search}`,
        }));
    }

    if(typeof season !== 'undefined' && typeof seasonYear !== 'undefined') {
        return dispatch(push({
            pathname: `/browse/${mediaType.toLowerCase()}/${seasonYear}/${season.toLowerCase()}`
        }));
    }
}

export default withRouter(connect(mapStateToProps, {
    filterChange
})(MediaPageFilter));