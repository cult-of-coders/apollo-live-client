## Apollo Live Client

# Apollo Live Implementation

```js
import { graphql } from 'react-apollo';
import { subscribeToMore, ReactiveEventFields } from 'apollo-live-react'

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
`

class Notifications extends React.Component {
  componentWillMount() {
    subscribeToMore(this, {
      document: SUBSCRIPTION_NOTIFICATIONS
      variables: {userId: this.props.userId},
    })
  }

  render() { ... }
}

export default graphql(QUERY_NOTIFICATIONS)(Notifications);
```

You can also roll-out your custom `updateQuery` and make use of `reduceStore` if you have more complex things in mind, or you are subscribing to multiple sources in the same place.

```js
import { reduceStore } from 'apollo-live-client';

// And in your updateQuery handler of subscribeToMore
  updateQuery: (prev, {subscriptionData}) {
    const reactiveEvent = subscriptionData.data.notifications;
    return Object.assign({}, prev, {
      notifications: reduceStore(reactiveEvent, prev.notifications)
    })
  },
```

`reduceStore` returns a new `object | object[]` based on the `ReactiveEvent` passed on. Note that `reduceStore` does not work with primitives, if for example, your query returns a string and not an object, tackle this yourself, it's much simpler that way.
