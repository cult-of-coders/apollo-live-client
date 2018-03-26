export enum Event {
  ADDED = 'added',
  CHANGED = 'changed',
  REMOVED = 'removed',
}

export interface StoreObject {
  _id: string;
  __typename: string;
  [key: string]: any;
}

export interface ReactiveEvent {
  event: Event;
  type: string;
  _id: string;
  doc?: any;
}

export interface SubscribeMoreConfig {
  document: any;
  variables: object;
}
