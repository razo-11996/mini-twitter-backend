const { paginateArray } = require('../../utils/pagination');

const queryResolvers = {
  Query: {
    users: async (parent, args, context) => {
      const users = await context.userService.getAllUsers();
      return paginateArray(users, args.first, args.after);
    },
    user: async (parent, args, context) => {
      return await context.userService.getUserById(args.id);
    },
    userByUsername: async (parent, args, context) => {
      return await context.userService.getUserByUsername(args.username);
    },
    tweets: async (parent, args, context) => {
      const tweets = await context.tweetService.getAllTweets();
      return paginateArray(tweets, args.first, args.after);
    },
    tweet: async (parent, args, context) => {
      return await context.tweetService.getTweetById(args.id);
    },
    tweetsByUser: async (parent, args, context) => {
      const tweets = await context.tweetService.getTweetsByUser(args.userId);
      return paginateArray(tweets, args.first, args.after);
    },
    feed: async (parent, args, context) => {
      const tweets = await context.tweetService.getFeed(args.userId);
      return paginateArray(tweets, args.first, args.after);
    },
  },
};

module.exports = queryResolvers;
