import * as React from 'react';
import PropTypes from 'prop-types';
import { reduceStore } from './reduceStore';
import { Query } from 'react-apollo';

export default class ReactiveQuery extends React.Component {
  render() {
    const { children, ...rest } = this.props;

    return (
      <Query query={rest.query} variables={rest.variables} delay={true}>
        {props => {
          return (
            <Subscription
              subscription={rest.subscription}
              variables={rest.variables}
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
