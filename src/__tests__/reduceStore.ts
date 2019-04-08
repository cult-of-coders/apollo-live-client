import { assert } from 'chai';
import { reduceStore } from '../reduceStore';
import { ReactiveEvent, StoreObject, Event } from '../defs';

describe('reduceStore', function() {
  it('Should run an update correctly', function() {
    const newStore = reduceStore(
      {
        event: Event.CHANGED,
        doc: {
          _id: '123',
          __typename: 'update',
          newField: 'new',
        },
      },
      [
        {
          _id: '123',
          __typename: 'current',
          title: 'abc',
        },
        {
          _id: '124',
          __typename: 'current',
          title: 'abcd',
        },
      ]
    );

    assert.lengthOf(newStore, 2);
    assert.isObject(newStore[0]);
    assert.isDefined(newStore[0].title);
    assert.isDefined(newStore[0].newField);
    // assert.equal('current', newStore[0].__typename);
  });
});
