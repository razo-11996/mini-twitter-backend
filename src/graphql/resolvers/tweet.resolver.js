const { paginateArray } = require('../../utils/pagination');

const tweetResolvers = {
  Tweet: {
    author: async (parent, args, context) => {
      return await context.userService.getUserById(parent.authorId);
    },
    likedBy: async (parent, args, context) => {
      const users = await context.tweetService.getLikedBy(parent.id);
      return paginateArray(users, args.first, args.after);
    },
  },
};

module.exports = tweetResolvers;
