const BaseService = require('../utils/base-service');
const { mapUsers } = require('../mappers/user.mapper');
const { EVENT_METHODS } = require('../utils/event-bus');
const { createService } = require('../utils/base-service');
const { executeQuery, executeWrite } = require('../utils/neo4j');
const TWEET_QUERIES = require('../repositories/tweet.repository');
const { mapTweet, mapTweets } = require('../mappers/tweet.mapper');

class TweetService extends BaseService {
  async getFollowerIds(session, authorId) {
    const queryResult = await executeQuery(session, TWEET_QUERIES.GET_FOLLOWER_IDS, {
      authorId,
    });

    if (!queryResult.records || queryResult.records.length === 0) {
      return [];
    }

    return queryResult.records.map((record) => record.get('id'));
  }

  async createTweet(session, input) {
    const userCheckResult = await executeQuery(
      session,
      TWEET_QUERIES.CHECK_USER_EXISTS,
      { authorId: input.authorId }
    );

    if (!userCheckResult.records || userCheckResult.records.length === 0) {
      throw new Error(`User with ID "${input.authorId}" does not exist.`);
    }

    const writeResult = await executeWrite(session, TWEET_QUERIES.CREATE, input);

    const record = writeResult.records[0];
    const authorId = record.get('authorId');
    const tweet = mapTweet(record.get('t'), authorId);

    await this.publishEvent(EVENT_METHODS.PUBLISH_TWEET_CREATED, tweet);

    const followerIds = await this.getFollowerIds(session, authorId);
    await Promise.all(
      followerIds.map((followerId) =>
        this.publishEvent(
          EVENT_METHODS.PUBLISH_NEW_TWEET_FROM_FOLLOWING,
          followerId,
          tweet
        )
      )
    );

    return tweet;
  }

  async getTweetById(session, id) {
    const queryResult = await executeQuery(session, TWEET_QUERIES.FIND_BY_ID, {
      id,
    });

    if (queryResult.records.length === 0) return null;

    const record = queryResult.records[0];
    return mapTweet(record.get('t'), record.get('authorId'));
  }

  async getAllTweets(session) {
    const queryResult = await executeQuery(session, TWEET_QUERIES.FIND_ALL);

    return mapTweets(queryResult.records, (record) => record.get('authorId'));
  }

  async getTweetsByUser(session, userId) {
    const queryResult = await executeQuery(session, TWEET_QUERIES.FIND_BY_USER, {
      userId,
    });

    return mapTweets(queryResult.records, (record) => record.get('authorId'));
  }

  async getFeed(session, userId) {
    const queryResult = await executeQuery(session, TWEET_QUERIES.FIND_FEED, {
      userId,
    });

    return mapTweets(queryResult.records, (record) => record.get('authorId'));
  }

  async deleteTweet(session, id) {
    const writeResult = await executeWrite(session, TWEET_QUERIES.DELETE, { id });

    const deletedCount = writeResult.records[0].get('deleted');

    return deletedCount ? deletedCount.toNumber() > 0 : false;
  }

  async likeTweet(session, tweetId, userId) {
    await executeWrite(session, TWEET_QUERIES.LIKE, { tweetId, userId });

    const tweet = await this.getTweetById(session, tweetId);

    await this.publishEvent(EVENT_METHODS.PUBLISH_TWEET_LIKED, tweetId, tweet);

    return tweet;
  }

  async unlikeTweet(session, tweetId, userId) {
    await executeWrite(session, TWEET_QUERIES.UNLIKE, { tweetId, userId });

    return await this.getTweetById(session, tweetId);
  }

  async retweet(session, tweetId, userId) {
    await executeWrite(session, TWEET_QUERIES.RETWEET, { tweetId, userId });

    return await this.getTweetById(session, tweetId);
  }

  async getLikedBy(session, tweetId) {
    const queryResult = await executeQuery(session, TWEET_QUERIES.GET_LIKED_BY, {
      tweetId,
    });

    return mapUsers(queryResult.records, 'user');
  }
}

function createTweetService(driver, eventBus) {
  return createService(TweetService, driver, eventBus);
}

module.exports = createTweetService;
