const { paginateArray } = require('../../utils/pagination');

const userResolvers = {
  User: {
    followers: async (parent, args, context) => {
      const followers = await context.userService.getFollowers(parent.id);
      return paginateArray(followers, args.first, args.after);
    },
    following: async (parent, args, context) => {
      const following = await context.userService.getFollowing(parent.id);
      return paginateArray(following, args.first, args.after);
    },
    tweets: async (parent, args, context) => {
      const tweets = await context.tweetService.getTweetsByUser(parent.id);
      return paginateArray(tweets, args.first, args.after);
    },
  },
};

module.exports = userResolvers;
