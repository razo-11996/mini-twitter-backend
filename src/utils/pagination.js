function encodeCursor(id, timestamp) {
  const cursor = `${id}:${timestamp}`;
  return Buffer.from(cursor).toString('base64');
}

function decodeCursor(cursor) {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    const [id, timestamp] = decoded.split(':');
    return { id, timestamp };
  } catch {
    throw new Error('Invalid cursor');
  }
}

function createConnection(items, hasMore) {
  const edges = items.map((item) => ({
    node: item,
    cursor: encodeCursor(item.id, item.createdAt),
  }));

  return {
    edges,
    pageInfo: {
      hasNextPage: hasMore,
      hasPreviousPage: false,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    },
  };
}

function paginateArray(items, first, after) {
  let filtered = items;
  const limit = Math.min(first || 20, 50);

  if (after) {
    const { timestamp } = decodeCursor(after);
    filtered = items.filter(
      (item) => new Date(item.createdAt) < new Date(timestamp)
    );
  }

  const hasMore = filtered.length > limit;
  const paginated = filtered.slice(0, limit);

  return createConnection(paginated, hasMore);
}

module.exports = {
  encodeCursor,
  decodeCursor,
  paginateArray,
  createConnection,
};
