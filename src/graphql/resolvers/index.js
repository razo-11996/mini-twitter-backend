const userResolvers = require('./user.resolver');
const tweetResolvers = require('./tweet.resolver');
const queryResolvers = require('./query.resolver');
const mutationResolvers = require('./mutation.resolver');
const { mergeResolvers } = require('@graphql-tools/merge');
const { subscriptionResolvers } = require('./subscription.resolver');

const resolvers = mergeResolvers([
  userResolvers,
  queryResolvers,
  tweetResolvers,
  mutationResolvers,
  subscriptionResolvers,
]);

module.exports = resolvers;
