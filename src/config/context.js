const neo4jDriver = require('./neo4j');
const createUserService = require('../services/user.service');
const createTweetService = require('../services/tweet.service');

function createContext(eventBus) {
  return {
    driver: neo4jDriver,
    userService: createUserService(neo4jDriver, eventBus),
    tweetService: createTweetService(neo4jDriver, eventBus),
  };
}

module.exports = { createContext };
