const EVENT_METHODS = {
  PUBLISH_TWEET_CREATED: 'publishTweetCreated',
  PUBLISH_TWEET_LIKED: 'publishTweetLiked',
  PUBLISH_USER_FOLLOWED: 'publishUserFollowed',
  PUBLISH_NEW_TWEET_FROM_FOLLOWING: 'publishNewTweetFromFollowing',
};

function createEventBus(pubsub, EVENTS) {
  return {
    [EVENT_METHODS.PUBLISH_TWEET_CREATED]: async (tweet) => {
      await pubsub.publish(EVENTS.TWEET_CREATED, { tweetCreated: tweet });
    },
    [EVENT_METHODS.PUBLISH_TWEET_LIKED]: async (tweetId, tweet) => {
      await pubsub.publish(`${EVENTS.TWEET_LIKED}_${tweetId}`, {
        tweetLiked: tweet,
      });
    },
    [EVENT_METHODS.PUBLISH_USER_FOLLOWED]: async (
      followedUserId,
      followerUser
    ) => {
      await pubsub.publish(`${EVENTS.USER_FOLLOWED}_${followedUserId}`, {
        userFollowed: followerUser,
      });
    },
    [EVENT_METHODS.PUBLISH_NEW_TWEET_FROM_FOLLOWING]: async (
      followerId,
      tweet
    ) => {
      await pubsub.publish(`${EVENTS.NEW_TWEET_FROM_FOLLOWING}_${followerId}`, {
        newTweetFromFollowing: tweet,
      });
    },
  };
}

module.exports = { createEventBus, EVENT_METHODS };
