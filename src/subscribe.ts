import { reduceStore } from './reduceStore';
import { SubscribeMoreConfig } from './defs';

export function subscribe(subscribeToMore, config: SubscribeMoreConfig) {
  return subscribeToMore({
    document: config.document,
    variables: config.variables,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;

      const storeName = Object.keys(subscriptionData.data)[0];

      return Object.assign({}, prev, {
        [storeName]: reduceStore(
          subscriptionData.data[storeName],
          prev[storeName]
        ),
      });
    },
  });
}
