const path = require('path');
const { WebSocketServer } = require('ws');
const { createContext } = require('./context');
const resolvers = require('../graphql/resolvers');
const { useServer } = require('graphql-ws/lib/use/ws');
const { loadSchemaSync } = require('@graphql-tools/load');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

function createWebSocketServer(eventBus) {
  const schema = loadSchemaSync(
    path.join(__dirname, '../graphql/schema/**/*.graphql'),
    {
      loaders: [new GraphQLFileLoader()],
    }
  );

  const schemaWithResolvers = addResolversToSchema({
    schema,
    resolvers,
  });

  const wsServer = new WebSocketServer({
    port: Number(process.env.WS_PORT || 4001),
    path: '/graphql',
    handleProtocols: (protocols) =>
      protocols.includes('graphql-transport-ws')
        ? 'graphql-transport-ws'
        : false,
  });

  const serverCleanup = useServer(
    {
      schema: schemaWithResolvers,
      context: async () => createContext(eventBus),
      onConnect: async () => {
        console.log('WebSocket connection established');
        return true;
      },
    },
    wsServer
  );

  return { wsServer, serverCleanup };
}

module.exports = { createWebSocketServer };
