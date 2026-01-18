const mutationResolvers = {
  Mutation: {
    createUser: async (parent, args, context) => {
      return await context.userService.createUser(args.input);
    },
    updateUser: async (parent, args, context) => {
      return await context.userService.updateUser(args.id, args.input);
    },
    followUser: async (parent, args, context) => {
      return await context.userService.followUser(
        args.userId,
        args.followUserId
      );
    },
    unfollowUser: async (parent, args, context) => {
      return await context.userService.unfollowUser(
        args.userId,
        args.unfollowUserId
      );
    },
    createTweet: async (parent, args, context) => {
      return await context.tweetService.createTweet(args.input);
    },
    deleteTweet: async (parent, args, context) => {
      return await context.tweetService.deleteTweet(args.id);
    },
    likeTweet: async (parent, args, context) => {
      return await context.tweetService.likeTweet(args.tweetId, args.userId);
    },
    unlikeTweet: async (parent, args, context) => {
      return await context.tweetService.unlikeTweet(args.tweetId, args.userId);
    },
    retweet: async (parent, args, context) => {
      return await context.tweetService.retweet(args.tweetId, args.userId);
    },
  },
};

module.exports = mutationResolvers;
