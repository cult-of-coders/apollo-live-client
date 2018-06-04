# Apollo Live Client

This project is sponsored by [Cult of Coders](https://www.cultofcoders.com)

This package provides an easy way to work with [`apollo-live-server`](https://github.com/cult-of-coders/apollo-live-server) subscriptions.

## Usage

```js
import gql from 'graphql-tag';
import { ReactiveQuery } from 'apollo-live-client';

const GET_MESSAGES = gql`
  query {
    messages(threadId: String) {
      _id
      text
      createdAt
    }
  }
`;

const SUBSCRIBE_MESSAGES = gql`
  subscription {
    messages(threadId: String) {
      event
      doc {
        _id
        text
        createdAt
      }
    }
  }
`;
```

For this system to work, the subscription root (`messages`) needs to be the same as the query . And you can query for more data from other fields in the RootQuery.

```js
const MessagesWithData = () => (
  <ReactiveQuery
    query={GET_ITEMS}
    subscription={SUBSCRIBE_MESSAGES}
    variables={{ threadId: 'XXX' }}
  >
    {({ data: { notifications }, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <Error error={error} />;

      return <PresentationalComponent notifications={notifications} />;
    }}
  </ReactiveQuery>
);
```

## Customisability

You can customise the behavior of how you handle incomming data from subscriptions, by rolling out your
own `subscribeToMore` and custom `updateQuery` method.

Read more about this here:
https://www.apollographql.com/docs/react/advanced/subscriptions.html

```js
import { reduceStore } from 'apollo-live-client';

// And in your updateQuery handler of subscribeToMore:
subscribeToMore({
  document: SUBSCRIBE_MESSAGES,
  variables: {},
  updateQuery: (prev, {subscriptionData}) {
    const reactiveEvent = subscriptionData.data.notifications;
    return Object.assign({}, prev, {
      notifications: reduceStore(reactiveEvent, prev.notifications)
    })
  },
})
```

## Bare-bones subscription

To provide you with even more flexibility, you can just roll your own subscription handler and reducer:

```js
// client = Apollo Client
const observable = client.subscribe({ query: SUBSCRIBE_NEWSFEED });
const subscription = observable.subscribe({
  next({ data }) {
    // data is your payload
    // do something with it
  },
});
subscription.unsubscribe();
```
