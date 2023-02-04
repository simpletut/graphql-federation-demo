import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

import PostsData from './../../db/posts.json'
import CommentsData from './../../db/comments.json';

const port = 4002;

const typeDefs = gql`
   type Post @key(fields: "id") {
     id: ID!
     title: String!
     body: String!
     postedBy: User
     comments: [Comment]
   }

  extend type User @key(fields: "id") {
    id: ID! @external
  }

  extend type Comment @key(fields: "id") {
    id: ID! @external
  }

  extend type Query {
    post(id: ID!): Post
    posts: [Post]
  }
`;

const resolvers = {
  Post: {
    postedBy(post) {
      return {
        __typename: 'User',
        id: post.postedBy
      }
    },
    comments(post) {
      return CommentsData.filter(comment => {
        return comment.post === post.id
      })
    },
    __resolveReference(ref) {
      return PostsData.find((post) => post.id === ref.id);
    }
  },
  Query: {
    post(_, { id }) {
      return PostsData.find(post => post.id === id);
    },
    posts() {
      return PostsData;
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(`Posts service ready at ${url}`);
});
