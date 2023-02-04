import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

import UsersData from './../../db/users.json';

const port = 4001;

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    username: String!
    email: String!
    address: UserAddress!
    phone: String!
    website: String!
    company: UserCompany!
  }

  type UserAddress {
    street: String!
    suite: String!
    city: String!
    zipcode: String!
    geo: AddressGeo
  }

  type AddressGeo {
    lat: String!
    lng: String!
  }

  type UserCompany {
    name: String!
    catchPhrase: String!
    bs: String!
  }

  extend type Query {
    users: [User]!
    user(id: ID!): User
  }
`;

const resolvers = {
  User: {
    __resolveReference(ref) {
      return UsersData.find((currUser) => currUser.id === ref.id);
    }
  },
  Query: {
    users() {
      return UsersData;
    },
    user(parent, args, contextValue) {
      const { id } = args;
      return UsersData.find(user => {
        return user.id === id;
      });
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(`Users service ready at ${url}`);
});