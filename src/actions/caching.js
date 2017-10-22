import idb from 'idb';
import _ from 'lodash/fp';

const dbName = 'dataCache';
const dbVersion = 1;

const dbPromise = idb.open(dbName, dbVersion, upgradeDb => {
    upgradeDb.createObjectStore('users');
    upgradeDb.createObjectStore('media');
    upgradeDb.createObjectStore('lists');
    upgradeDb.createObjectStore('customLists');
});

const loadFromCache = objectStore => key => (
    dbPromise.then(db => db.transaction(objectStore))
    .then(tx => tx.objectStore(objectStore).get(key))
    .then(value => typeof value === 'undefined' ? Promise.reject("value not cached") : value)
);

const loadAllFromCache = objectStore => () => (
    dbPromise.then(db => db.transaction(objectStore))
    .then(tx => {
        const store = tx.objectStore(objectStore);
        return (
            store.getAllKeys()
            .then(keys => {
                const pairs = keys.map(
                    key => store.get(key).then(value => [key, value]));
                if(keys.length === 0) {
                    return Promise.reject('cache is empty');
                }
                return (
                    Promise.all(pairs)
                        .then(() => {
                            return pairs.reduce((allPairs, current) => (
                                allPairs.then(
                                    pairs => current.then(pair => pairs.concat(pair))
                                )),
                                Promise.resolve([])
                            );
                        })
                        .then(pairs => _.fromPairs(pairs))
                );
            })
        );
    })
);

export const loadViewerFromCache = () => loadFromCache('users')('viewer');
export const loadMediaFromCache = loadFromCache('media');
export const loadListsFromCache = loadAllFromCache('lists');
export const loadCustomListsFromCache = loadAllFromCache('customLists');

const cache = objectStore => (key, value) => (
    dbPromise.then(db => db.transaction(objectStore, 'readwrite'))
    .then(tx => {
        tx.objectStore(objectStore).put(value, key);
        return tx.complete;
    })
);
export const cacheAll = objectStore => keyVal => Promise.all(
    Object.keys(keyVal).map(key => cache(objectStore)(key, keyVal[key]))
);

export const cacheViewer = value => cache('users')('viewer', value);
export const cacheMedia = cache('media');
export const cacheLists = cacheAll('lists');
export const cacheCustomLists = cacheAll('customLists');