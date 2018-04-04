export enum Event {
  ADDED = 'added',
  CHANGED = 'changed',
  REMOVED = 'removed',
}

export type ReactiveEvent = {
  event: Event;
  doc: StoreObject;
};

export interface StoreObject {
  _id: string | number;
  __typename: string;
  [key: string]: any;
}

export type SubscribeMoreParam = {
  type: string;
  value: any;
};

export interface SubscribeMoreConfig {
  name: string;
  params: {
    [key: string]: SubscribeMoreParam;
  };
}
