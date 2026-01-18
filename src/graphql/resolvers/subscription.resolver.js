const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const EVENTS = {
  TWEET_LIKED: 'TWEET_LIKED',
  TWEET_CREATED: 'TWEET_CREATED',
  USER_FOLLOWED: 'USER_FOLLOWED',
  NEW_TWEET_FROM_FOLLOWING: 'NEW_TWEET_FROM_FOLLOWING',
};

const subscriptionResolvers = {
  Subscription: {
    tweetCreated: {
      subscribe: () => pubsub.asyncIterator([EVENTS.TWEET_CREATED]),
    },
    tweetLiked: {
      subscribe: (parent, args) =>
        pubsub.asyncIterator([`${EVENTS.TWEET_LIKED}_${args.tweetId}`]),
    },
    userFollowed: {
      subscribe: (parent, args) =>
        pubsub.asyncIterator([`${EVENTS.USER_FOLLOWED}_${args.userId}`]),
    },
    newTweetFromFollowing: {
      subscribe: (parent, args) =>
        pubsub.asyncIterator([
          `${EVENTS.NEW_TWEET_FROM_FOLLOWING}_${args.userId}`,
        ]),
    },
  },
};

module.exports = { subscriptionResolvers, pubsub, EVENTS };
