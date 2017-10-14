import { CALL_API } from "../middleware/api";

export const PAGE_REQUEST = Symbol("Page Request");
export const PAGE_RESPONSE = Symbol("Page Response");
export const RESET_PAGE_DATA = Symbol("Reset Page Data")

const fetchPage = (contentQuery, contentType) => vars => ({
    type: PAGE_REQUEST,
    meta: {
        [CALL_API]: {
            query: contentQuery,
            responseType: PAGE_RESPONSE
        }
    },
    payload: { vars, contentType }
});

const loadPage = (contentQuery, contentType) => vars => (dispatch, getState) => {
    const { page } = vars;
    if (getState().pageData[contentType]) {
        const response = getState().pageData[contentType][page];
        if (response) {
         return null;   
        }
    }
    return dispatch(fetchPage(contentQuery, contentType)(vars));
}


const mediaQuery = `
query pageQuery($page: Int, $perPage: Int,
    $season: MediaSeason, $seasonYear: Int,
    $search: String, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            hasNextPage
        }
    media(season: $season, seasonYear: $seasonYear,
            search: $search, type: $type) {
        id
        title {
            romaji
            english
            native
        }
        averageScore
        coverImage {
            large
        }
        description
    }
    }
}`;

const resetPageData = (contentType) => ({
    type: RESET_PAGE_DATA,
    payload: {
        contentType
    }
});

export const loadMediaPage = loadPage(mediaQuery, 'media');

export const reloadMediaPages = vars => (dispatch, getState) => {
    dispatch(resetPageData('media'));
    dispatch(loadMediaPage(vars));
}