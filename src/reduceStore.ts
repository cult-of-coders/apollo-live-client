import { ReactiveEvent, StoreObject, Event } from './defs';

export function reduceStore(
  reactiveEvent: ReactiveEvent,
  store: StoreObject[] | StoreObject
) {
  if (store instanceof Array) {
    return reduceStoreArray(reactiveEvent, store);
  }
  return reduceStoreObject(reactiveEvent, store);
}

export function reduceStoreObject(
  reactiveEvent: ReactiveEvent,
  store: StoreObject
) {
  const { event, type, doc, _id } = reactiveEvent;
  if (event === Event.ADDED) {
    return {
      _id,
      __typename: type,
      ...doc,
    };
  }
  if (event === Event.CHANGED) {
    return Object.assign({}, store, doc);
  }
  if (event === Event.REMOVED) {
    return {
      _id: -1,
    };
  }
}

export function reduceStoreArray(
  reactiveEvent: ReactiveEvent,
  store: StoreObject[]
): StoreObject[] {
  const { event, type, doc, _id } = reactiveEvent;

  if (event === Event.ADDED) {
    const entry = {
      _id,
      __typename: type,
      ...doc,
    };
    return [entry, ...store];
  }

  if (event === Event.CHANGED) {
    let foundIdx;
    const found = store.find((item, idx) => {
      if (item._id === _id) {
        foundIdx = idx;
        return true;
      }
    });

    if (!found) {
      return store;
    }

    const newFound = Object.assign({}, found, doc);
    return [
      ...store.slice(0, foundIdx),
      newFound,
      ...store.slice(foundIdx + 1),
    ];
  }

  if (event === Event.REMOVED) {
    return store.filter(item => item._id !== _id);
  }
}
