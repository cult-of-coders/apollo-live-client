# Apollo Live Client

```js
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { subscribe, ReactiveEventFields } from 'apollo-live-client';

// ReactiveEventFields is just: { type, event, _id, doc }
const QUERY_NOTIFICATIONS = gql`
  query notifications {
    notifications(reactive: true) {
      _id
      text
      createdAt
    }
  }
`;

const SUBSCRIPTION_NOTIFICATIONS = gql`
  subscription MySub($userId: String) {
    notifications(userId: $userId) {
      ${ReactiveEventFields}
    }
  }
`;
```

Via `graphql` higher order component:

```js
class Notifications extends React.Component {
  componentWillMount() {
    const { subscribeToMore } = this.props.data;
    this.unsubscribe = subscribe(subscribeToMore, {
      document: SUBSCRIPTION_NOTIFICATIONS
      variables: {userId: this.props.userId},
    })

    // You don't have to unsubscribe in unmounting, this is handled automatically
  }

  render() { ... }
}

export default graphql(QUERY_NOTIFICATIONS)(Notifications);
```

Via `<Query/>`:

```js
class Notifications extends React.Component {
  componentWillMount() {
    const { subscribeToMore } = this.props; // note that unlike the one above it doesn't have .data
    this.unsubscribe = subscribe(subscribeToMore, ...)
  }

  render() { ... }
}

export default () => {
  return (
    <Query query={GET_ITEMS}>
      {props => {
        // You may be tempted to do the subscription here, don't because on every change you'll resubscribe again
        return <Notifications {...props} />;
      }}
    </Query>
  );
};
```

Note that the name of subscription and query is the same `notifications`. This is how this package knows how and what to update.

You can also roll-out your custom `updateQuery` and make use of `reduceStore` if you have more complex things in mind, or you are subscribing to multiple sources in the same place.

```js
import { reduceStore } from 'apollo-live-client';

// And in your updateQuery handler of subscribeToMore:
{
  ...,
  updateQuery: (prev, {subscriptionData}) {
    const reactiveEvent = subscriptionData.data.notifications;
    return Object.assign({}, prev, {
      notifications: reduceStore(reactiveEvent, prev.notifications)
    })
  },
}
```

`reduceStore` returns a new `object | object[]` based on the `ReactiveEvent` passed on. Note that `reduceStore` does not work with primitives, if for example, your query returns a string and not an object, tackle this yourself, it's much simpler that way.

## Premium Support

Looking to start or develop your new project with **GraphQL**? Reach out to us now, we can help you along every step: contact@cultofcoders.com. We specialise in building high availability GraphQL APIs and with the help with our awesome frontend developers we can easily consume any GraphQL API.
