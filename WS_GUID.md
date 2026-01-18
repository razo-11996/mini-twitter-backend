after you connect ws://localhost:4001/graphql , you must send:

1) connection_init
2) wait for connection_ack, then send subscription using subscribe:

{
  "id": "1",
  "type": "subscribe",
  "payload": {
    "query": "subscription { tweetCreated { id content createdAt } }"
  }
}

that's it, you'll receive event once tweet is created