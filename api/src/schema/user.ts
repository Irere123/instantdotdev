export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    username: String!
    displayName: String!
  }

  type Query {
    getAllUsers: [User]
  }
`;

export const resolvers = {
  Query: {
    getAllUsers: () => [],
  },
};
