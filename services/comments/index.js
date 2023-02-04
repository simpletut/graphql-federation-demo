import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

import CommentsData from './../../db/comments.json'

const port = 4003;

const typeDefs = gql`
   type Comment @key(fields: "id") {
     id: ID!
     post: Post
     body: String!
     postedBy: User
   }

  extend type User @key(fields: "id") {
    id: ID! @external
  }

  extend type Post @key(fields: "id") {
    id: ID! @external
  }

  extend type Query {
    comments: [Comment]
  }
`;

const resolvers = {
  Comment: {
    postedBy(comment) {
      return {
        __typename: 'User',
        id: comment.postedBy
      }
    },
    post(comment) {
      return {
        __typename: 'Post',
        id: comment.post
      }
    },
    __resolveReference(ref) {
      return CommentsData.find((comment) => comment.id === ref.id);
    }
  },
  Query: {
    comments() {
      return CommentsData;
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(`Comments service ready at ${url}`);
});
