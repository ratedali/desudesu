import apiSpec from "./apiSpec";

export function mediaTypeFromMatchParam(mediaTypeParam) {
    return typeof mediaTypeParam === 'string' ? 
    apiSpec.mediaType[mediaTypeParam.toLowerCase()] : undefined;
}

export function seasonFromMatchParam(seasonParam) {
    return typeof seasonParam === 'string' ?
    apiSpec.seasons[seasonParam.toLowerCase()] : undefined;
}

export const animeUrlById = animeId => `${apiSpec.baseUrl}/anime/${encodeURIComponent(animeId)}`;
export const mangaUrlById = mangaId => `${apiSpec.baseUrl}/manga/${encodeURIComponent(mangaId)}`;
export function mediaUrlById(type) {
    if(type === apiSpec.mediaType.anime) {
        return animeUrlById;
    } else if (type === apiSpec.mediaType.manga) {
        return animeUrlById;
    }
};