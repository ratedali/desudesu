import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import apiSpec from "../apiSpec";
import { loadMediaPage, reloadMediaPages } from '../actions/pageActions';
import MediaPage from '../components/MediaPage';
import  _ from 'lodash/fp';

const mapStateToProps = (state, ownProps) => {
    const { 
        match: {
            params: {
                seasonYear,
                season,
                search,
                mediaType,
            }
        },
        perPage
    } = ownProps;

    const mediaPageData = state.pageData.media;
    let page;
    if(!mediaPageData && typeof state.pageData.lastPage === 'undefined') {
        page = 1;
    } else {
        page = mediaPageData.lastPage;
    }

    const { seasons, mediaType: types } = apiSpec;

    const sharedProps = {
        season: typeof season !== 'undefined' ? seasons[season.toLowerCase()] : season,
        seasonYear,
        page: parseInt(page, 10),
        search,
        mediaType: types[mediaType.toLowerCase()],
        perPage
    }


    if(!mediaPageData || !mediaPageData.pages[page]) {
        return sharedProps;
    }

    const { 
        isLoading,
        error,
        errorObject,
        response 
    } = mediaPageData.pages[page];

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

    if(!response) {
        return sharedProps;
    }

    const media = (
        _.flatMap(([key, mediaPage]) => mediaPage.response.Page.media)(
            _.filter(([key, ]) => parseInt(key, 10) < parseInt(page, 10))(
                _.toPairs(state.pageData.media.pages))
        ));
    return {
        ...sharedProps,
        media: _.concat(media, response.Page.media),
        hasNextPage: response.Page.pageInfo.hasNextPage
    }

}

export default withRouter(connect(
    mapStateToProps,
    {
        loadMediaPage, 
        reloadMediaPages
    })(MediaPage)
);