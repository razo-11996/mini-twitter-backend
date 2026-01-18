const BaseService = require('../utils/base-service');
const { mapUser, mapUsers } = require('../mappers/user.mapper');
const { EVENT_METHODS } = require('../utils/event-bus');
const { createService } = require('../utils/base-service');
const USER_QUERIES = require('../repositories/user.repository');
const { executeQuery, executeWrite } = require('../utils/neo4j');

class UserService extends BaseService {
  async createUser(session, input) {
    const writeResult = await executeWrite(session, USER_QUERIES.CREATE, input);

    return mapUser(writeResult.records[0].get('u'));
  }

  async getUserById(session, id) {
    const queryResult = await executeQuery(session, USER_QUERIES.FIND_BY_ID, {
      id,
    });

    if (queryResult.records.length === 0) return null;

    return mapUser(queryResult.records[0].get('u'));
  }

  async getUserByUsername(session, username) {
    const queryResult = await executeQuery(session, USER_QUERIES.FIND_BY_USERNAME, {
      username,
    });

    if (queryResult.records.length === 0) return null;

    return mapUser(queryResult.records[0].get('u'));
  }

  async getUserByName(session, name) {
    const queryResult = await executeQuery(session, USER_QUERIES.FIND_BY_NAME, {
      name,
    });

    if (queryResult.records.length === 0) return null;

    return mapUser(queryResult.records[0].get('u'));
  }

  async getAllUsers(session) {
    const queryResult = await executeQuery(session, USER_QUERIES.FIND_ALL);

    return mapUsers(queryResult.records);
  }

  async updateUser(session, id, input) {
    const updateData = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value != null)
    );

    if (Object.keys(updateData).length === 0) {
      return await this.getUserById(session, id);
    }

    const updateFields = Object.keys(updateData)
      .map((key) => `u.${key} = $${key}`)
      .join(', ');

    const writeResult = await executeWrite(
      session,
      USER_QUERIES.UPDATE(updateFields),
      { id, ...updateData }
    );

    return mapUser(writeResult.records[0].get('u'));
  }

  async followUser(session, userId, followUserId) {
    await executeWrite(session, USER_QUERIES.FOLLOW, {
      userId,
      followUserId,
    });

    const follower = await this.getUserById(session, userId);

    await this.publishEvent(
      EVENT_METHODS.PUBLISH_USER_FOLLOWED,
      followUserId,
      follower
    );

    return follower;
  }

  async unfollowUser(session, userId, unfollowUserId) {
    await executeWrite(session, USER_QUERIES.UNFOLLOW, {
      userId,
      unfollowUserId,
    });

    return await this.getUserById(session, userId);
  }

  async getFollowers(session, userId) {
    const queryResult = await executeQuery(session, USER_QUERIES.GET_FOLLOWERS, {
      userId,
    });

    return mapUsers(queryResult.records, 'follower');
  }

  async getFollowing(session, userId) {
    const queryResult = await executeQuery(session, USER_QUERIES.GET_FOLLOWING, {
      userId,
    });

    return mapUsers(queryResult.records, 'following');
  }
}

function createUserService(driver, eventBus) {
  return createService(UserService, driver, eventBus);
}

module.exports = createUserService;
