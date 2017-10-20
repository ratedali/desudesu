import apiSpec from "./apiSpec";

export function mediaTypeFromMatchParam(mediaTypeParam) {
    return typeof mediaTypeParam === 'string' ? 
    apiSpec.mediaType[mediaTypeParam.toLowerCase()] : undefined;
}

export function seasonFromMatchParam(seasonParam) {
    return typeof seasonParam === 'string' ?
    apiSpec.seasons[seasonParam.toLowerCase()] : undefined;
}

export const mediaListLabelFromType = mediaType => (
    mediaType === apiSpec.mediaType.anime ?
    animeListLabelFromType : mangaListLabelFromType
)

function animeListLabelFromType(animeListType) {
    const labelsMap = new Map([
        ['completed', 'Completed'],
        ['planning', 'Planning to Watch'],
        ['paused', 'On Hold'],
        ['dropped', 'Dropped'],
        ['current', 'Watching']
    ]);
    return labelsMap.get(animeListType);
}

function mangaListLabelFromType(mangaListType) {
    const labelsMap = new Map([
        ['completed', 'Completed'],
        ['planning', 'Planning to Read'],
        ['paused', 'On Hold'],
        ['dropped', 'Dropped'],
        ['current', 'Reading']
    ]);
    return labelsMap.get(mangaListType);
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