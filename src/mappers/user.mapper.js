function mapUser(userNode) {
  const properties = userNode.properties;

  return {
    id: properties.id,
    email: properties.email,
    bio: properties.bio || null,
    username: properties.username,
    name: properties.name || null,
    createdAt: properties.createdAt.toString(),
  };
}

function mapUsers(records, nodeKey = 'u') {
  if (!records || records.length === 0) {
    return [];
  }

  return records.map((record) => mapUser(record.get(nodeKey)));
}

module.exports = { mapUser, mapUsers };
