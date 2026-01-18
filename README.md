# 🐦 Mini Twitter Backend

A minimal Twitter-like backend showcasing GraphQL, real-time updates, and graph-based social relationships.

- 📦 **Collection (JSON)**:  
  [`mini-twitter.postman_collection.json`](./postman/collections/mini-twitter-backend.postman_collection.json)

## Features

- GraphQL API (Apollo Server)
- Neo4j graph database for social relationships
- Real-time subscriptions via WebSocket
- Cursor-based pagination
- User management (create, update, follow/unfollow)
- Tweet operations (create, delete, like, retweet)
- Feed generation based on following relationships
- Event-driven architecture with PubSub

## Architecture

Built using clean architecture principles:
- Service layer for business logic
- Repository pattern for data access
- Clear separation of concerns
- Robust error handling

## Tech Stack

- Node.js
- Apollo Server
- Neo4j
- WebSocket
