const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { createContext } = require('./context');
const resolvers = require('../graphql/resolvers');
const { ApolloServer } = require('@apollo/server');
const { loadSchemaSync } = require('@graphql-tools/load');
const { expressMiddleware } = require('@apollo/server/express4');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');

function createApolloServer(httpServer, eventBus, additionalPlugins = []) {
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

  return new ApolloServer({
    schema: schemaWithResolvers,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ...additionalPlugins,
    ],
  });
}

function createExpressApp(apolloServer, eventBus) {
  const app = express();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async () => createContext(eventBus),
    })
  );

  return app;
}

module.exports = { createApolloServer, createExpressApp };
