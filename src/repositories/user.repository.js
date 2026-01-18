const USER_QUERIES = {
  CREATE: `
    CREATE (u:User {
      id: randomUUID(),
      username: $username,
      email: $email,
      name: $name,
      bio: $bio,
      createdAt: datetime()
    })
    RETURN u
  `,
  FIND_BY_ID: 'MATCH (u:User {id: $id}) RETURN u',
  FIND_BY_USERNAME: 'MATCH (u:User {username: $username}) RETURN u',
  FIND_BY_NAME: 'MATCH (u:User {name: $name}) RETURN u',
  FIND_ALL: 'MATCH (u:User) RETURN u ORDER BY u.createdAt DESC',
  UPDATE: (fields) => `MATCH (u:User {id: $id}) SET ${fields} RETURN u`,
  FOLLOW: `
    MATCH (u:User {id: $userId}), (f:User {id: $followUserId})
    MERGE (u)-[:FOLLOWS]->(f)
    RETURN u
  `,
  UNFOLLOW: `
    MATCH (u:User {id: $userId})-[r:FOLLOWS]->(f:User {id: $unfollowUserId})
    DELETE r
    RETURN u
  `,
  GET_FOLLOWERS: `
    MATCH (u:User {id: $userId})<-[:FOLLOWS]-(follower:User)
    RETURN follower
    ORDER BY follower.createdAt DESC
  `,
  GET_FOLLOWING: `
    MATCH (u:User {id: $userId})-[:FOLLOWS]->(following:User)
    RETURN following
    ORDER BY following.createdAt DESC
  `,
};

module.exports = USER_QUERIES;
