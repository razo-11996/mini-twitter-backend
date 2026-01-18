async function executeQuery(session, query, params = {}) {
  return await session.run(query, params);
}

async function executeWrite(session, query, params = {}) {
  return await session.writeTransaction((tx) => {
    return tx.run(query, params);
  });
}

async function withSession(driver, callback) {
  const session = driver.session();
  try {
    return await callback(session);
  } finally {
    await session.close();
  }
}

module.exports = {
  executeQuery,
  executeWrite,
  withSession,
};
