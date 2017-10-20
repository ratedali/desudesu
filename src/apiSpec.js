import { 
    key,
    redirect,
    origin
} from './apiKey';

export default {
    baseUrl: 'https://anilist.co',
    mediaType: {
        anime: 'ANIME',
        manga: 'MANGA'
    },
    seasons: {
        winter: 'WINTER',
        spring: 'SPRING',
        summer: 'SUMMER',
        fall: 'FALL'
    },
    mediaFormat: {
        tv: 'TV',
        short: 'TV_SHORT',
        movie: 'MOVIE',
        special: 'SPECIAL',
        ova: 'OVA',
        ona: 'ONA',
        music: 'MUSIC',
        manga: 'MANGA',
        novel: 'NOVEL',
        oneShot: 'ONE_SHOT'
    },
    mediaStatus: {
        finished: 'FINISHED',
        releasing: 'RELEASING',
        notReleased: 'NOT_YET_RELEASED',
        cancelled: 'CANCELLED'
    },
    auth: {
        url: `https://anilist.co/api/v2/oauth/authorize?client_id=${encodeURIComponent(key)}&response_type=token`,
        redirect,
        origin,
        key,
    }
}
