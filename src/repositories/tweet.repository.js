const TWEET_QUERIES = {
  CHECK_USER_EXISTS:
    'MATCH (author:User {id: $authorId}) RETURN author.id as userId',
  CREATE: `
    MATCH (author:User {id: $authorId})
    CREATE (t:Tweet {
      id: randomUUID(),
      content: $content,
      createdAt: datetime(),
      likes: 0,
      retweets: 0
    })
    CREATE (author)-[:POSTED]->(t)
    RETURN t, author.id as authorId
  `,
  FIND_BY_ID: `
    MATCH (t:Tweet {id: $id})<-[:POSTED]-(author:User)
    RETURN t, author.id as authorId
  `,
  FIND_ALL: `
    MATCH (t:Tweet)<-[:POSTED]-(author:User)
    RETURN t, author.id as authorId
    ORDER BY t.createdAt DESC
  `,
  FIND_BY_USER: `
    MATCH (author:User {id: $userId})-[:POSTED]->(t:Tweet)
    RETURN t, author.id as authorId
    ORDER BY t.createdAt DESC
  `,
  FIND_FEED: `
    MATCH (user:User {id: $userId})-[:FOLLOWS]->(following:User)-[:POSTED]->(t:Tweet)
    RETURN t, following.id as authorId
    ORDER BY t.createdAt DESC
    LIMIT 50
  `,
  DELETE: `
    MATCH (t:Tweet {id: $id})
    DETACH DELETE t
    RETURN count(t) as deleted
  `,
  LIKE: `
    MATCH (t:Tweet {id: $tweetId}), (u:User {id: $userId})
    MERGE (u)-[:LIKED]->(t)
    SET t.likes = t.likes + 1
    RETURN t
  `,
  UNLIKE: `
    MATCH (u:User {id: $userId})-[r:LIKED]->(t:Tweet {id: $tweetId})
    DELETE r
    SET t.likes = t.likes - 1
    RETURN t
  `,
  RETWEET: `
    MATCH (t:Tweet {id: $tweetId}), (u:User {id: $userId})
    MERGE (u)-[:RETWEETED]->(t)
    SET t.retweets = t.retweets + 1
    RETURN t
  `,
  GET_LIKED_BY: `
    MATCH (t:Tweet {id: $tweetId})<-[:LIKED]-(user:User)
    RETURN user
    ORDER BY user.createdAt DESC
  `,
  GET_FOLLOWER_IDS: `
    MATCH (author:User {id: $authorId})<-[:FOLLOWS]-(follower:User)
    RETURN follower.id as id
  `,
};

module.exports = TWEET_QUERIES;
