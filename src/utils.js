import spec from "./apiSpec";

export const animeUrlById = animeId => `${spec.baseUrl}/anime/${encodeURIComponent(animeId)}`;
export const mangaUrlById = mangaId => `${spec.baseUrl}/manga/${encodeURIComponent(mangaId)}`;
export const mediaUrlById = (type) => {
    if(type === spec.mediaType.anime) {
        return animeUrlById;
    } else if (type === spec.mediaType.manga) {
        return animeUrlById;
    }
};