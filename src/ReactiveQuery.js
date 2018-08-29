import * as React from 'react';
import * as PropTypes from 'prop-types';
import { reduceStore } from './reduceStore';
import { Query } from 'react-apollo';

export default class ReactiveQuery extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    subscription: PropTypes.object.isRequired,
  };

  render() {
    const { children, subscription, variables, ...rest } = this.props;

    return (
      <Query variables={variables} {...rest}>
        {props => {
          return (
            <Subscription
              subscription={subscription}
              variables={variables}
              {...props}
            >
              {() => {
                return children(props);
              }}
            </Subscription>
          );
        }}
      </Query>
    );
  }
}

class Subscription extends React.Component {
  componentDidMount = () => {
    const { subscribeToMore, subscription, variables } = this.props;

    subscribeToMore({
      document: subscription,
      variables: variables,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const storeName = Object.keys(subscriptionData.data)[0];

        const newStore = Object.assign({}, prev, {
          [storeName]: reduceStore(
            subscriptionData.data[storeName],
            prev[storeName]
          ),
        });

        return newStore;
      },
    });
  };

  render() {
    const { children, ...rest } = this.props;

    return children(rest);
  }
}
