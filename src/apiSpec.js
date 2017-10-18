import { 
    key,
    redirect,
    origin
} from './apiKey';

export default {
    baseUrl: 'https://anilist.co',
    mediaType: {
        anime: 'ANIME',
        manga: 'MANGA',
    },
    seasons: {
        winter: 'WINTER',
        spring: 'SPRING',
        summer: 'SUMMER',
        fall: 'FALL',
    },
    auth: {
        url: `https://anilist.co/api/v2/oauth/authorize?client_id=${encodeURIComponent(key)}&response_type=token`,
        redirect,
        origin,
        key,
    }
}
