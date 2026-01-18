function mapTweet(tweetNode, authorId) {
  const properties = tweetNode.properties;

  return {
    id: properties.id,
    authorId: authorId,
    content: properties.content,
    likes: properties.likes.toNumber(),
    retweets: properties.retweets.toNumber(),
    createdAt: properties.createdAt.toString(),
  };
}

function mapTweets(records, authorIdExtractor) {
  if (!records || records.length === 0) {
    return [];
  }

  return records.map((record) => {
    const tweetNode = record.get('t');
    const authorId = authorIdExtractor ? authorIdExtractor(record) : record.get('authorId');
    return mapTweet(tweetNode, authorId);
  });
}

module.exports = { mapTweet, mapTweets };
