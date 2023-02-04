import { ApolloGateway } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";

const port = 4000;

const gateway = new ApolloGateway({
  serviceList: [
    { name: "users", url: "http://localhost:4001" },
    { name: "posts", url: "http://localhost:4002" },
    { name: "comments", url: "http://localhost:4003" },
  ]
});

const server = new ApolloServer({
  gateway,
  subscriptions: false
});

server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});