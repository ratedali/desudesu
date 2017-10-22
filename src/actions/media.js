import { CALL_API } from '../middleware/api';
import { loadMediaFromCache, cacheMedia } from './caching';

export const MEDIA_REQUEST = Symbol('Media Request');
export const MEDIA_RESPONSE = Symbol('Media Response');

export const mediaContent = 
`... on Media {
    id
    idMal
    title {
        native
        english
        romaji
    }
    type
    format
    status
    description
    season
    episodes
    chapters
    volumes
    coverImage {
        large
        medium
    }
    bannerImage
    averageScore
    popularity
    tags {
        id
        isMediaSpoiler
    }
}`;

const fetchMedia = vars => ({
    type: MEDIA_REQUEST,
    meta: {
        [CALL_API]: {
            query:
            `query mediaQuery($id: Int, $idMal: Int, $mediaType: MediaType){
                Media(id: $id, idMal: $idMal, type: $mediaType) {
                    ${mediaContent}
                }
            }`,
            responseType: MEDIA_RESPONSE
        }
    }, 
    payload: {
        vars
    }
});

export const loadMedia = vars => (dispatch, getState) => {
    const {
        mediaType,
        id,
    } = vars;

    const mediaData = getState().media[mediaType];
    if(mediaData && mediaData[id]) {
        return null;
    }

    let networkFinished = false;
    const network = dispatch(fetchMedia(vars)).then(
        data => {
            networkFinished = true;
            cacheMedia(id, data.Media);
            return data;
        }
    );
    const cache = loadMediaFromCache(id).then(media => {
        const payload = {
            Media: media
        };
        if(!networkFinished) {
            dispatch({
                type: MEDIA_RESPONSE,
                meta: {
                    mediaType,
                    id
                },
                payload
            });
        }
        return payload;
    }).catch(() => Promise.resolve());
    return Promise.all([network, cache]);
}