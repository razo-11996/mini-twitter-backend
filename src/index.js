require('dotenv').config();
const http = require('http');
const { createEventBus } = require('./utils/event-bus');
const { createWebSocketServer } = require('./config/websocket');
const { createApolloServer, createExpressApp } = require('./config/server');
const { pubsub, EVENTS } = require('./graphql/resolvers/subscription.resolver');

async function startServer() {
  const eventBus = createEventBus(pubsub, EVENTS);
  const httpServer = http.createServer();

  const { wsServer, serverCleanup } = createWebSocketServer(eventBus);

  const wsPlugin = {
    async serverWillStart() {
      return {
        async drainServer() {
          await serverCleanup.dispose();
          await new Promise((resolve) => wsServer.close(resolve));
        },
      };
    },
  };

  const apolloServer = createApolloServer(httpServer, eventBus, [wsPlugin]);
  await apolloServer.start();

  const app = createExpressApp(apolloServer, eventBus);
  httpServer.on('request', app);

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(
      `📡 Subscriptions ready at ws://localhost:${process.env.WS_PORT || 4001}/graphql`
    );
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
