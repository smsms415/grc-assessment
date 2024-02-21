import { ApolloServer } from "@apollo/server";
const {
  DynamoDBClient,
  ListTablesCommand,
  ScanCommand,
  QueryCommand,
  GetItemCommand,
} = require("@aws-sdk/client-dynamodb");

import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import { DynamoDataSource } from "./datasources/DynamoDbSource";

const typeDefs = `#graphql
  type Concept {
    conceptId: Int!
    displayName: String
    description: String
    parentIds: [Int]
    childIds: [Int]
    parents: [Concept]
    children: [Concept]
    alternateNames: [String]
  }

  type Query {
    topLevelConcepts: [Concept]
    allConcepts: [Concept]
    concept(conceptId: Int!): Concept
    searchByString(str: String!): [Concept]
  }

  type Mutation {
    createConcept(displayName: String!): Concept
    updateConceptName(conceptId: Int!, displayName: String!): Concept
    # updateConceptDescription(conceptId: Int!, description: String!): Concept
  }
`;

const resolvers = {
  Query: {
    searchByString: async (_, { str }, { dataSources }) => {
      try {
        str = str.toLowerCase();
        const results = await dataSources.ddb.getAllConcepts();
        return results.filter(
          ({ displayName, description }) =>
            displayName.toLowerCase().includes(str) ||
            description.toLowerCase().includes(str)
        );
      } catch (err) {
        // TODO implement actual error handling.
        console.error(err);
      }
    },
    topLevelConcepts: async (_, __, { dataSources }) => {
      try {
        const results = await dataSources.ddb.getTopLevelConcepts();
        return results;
      } catch (err) {
        // TODO implement actual error handling.
        console.error(err);
      }
    },
    concept: async (parent, { conceptId }, { dataSources }) => {
      try {
        const result = await dataSources.ddb.getConceptById(conceptId);

        return result;
      } catch (err) {
        // TODO implement actual error handling.
        console.error(err);
      }
    },
    allConcepts: async (_, __, { dataSources }) => {
      try {
        const results = await dataSources.ddb.getAllConcepts();
        return results;
      } catch (err) {
        // TODO implement actual error handling.
        console.error(err);
      }
    },
  },
  Mutation: {
    createConcept: async (_, { displayName }, { dataSources: { ddb } }) => {
      const concept = await ddb.createConcept(displayName);
      return concept;
    },
    updateConceptName: async (
      _,
      { conceptId, displayName },
      { dataSources: { ddb } }
    ) => {
      const concept = await ddb.updateConceptName(conceptId, displayName);
      return concept;
    },
  },

  Concept: {
    children: async (parent, _, { dataSources: { ddb } }) => {
      const results = await Promise.all(
        Array.from(parent.childIds ?? []).map(
          async (id) => await ddb.getConceptById(id)
        )
      );
      return results;
    },
    parents: async (parent, _, { dataSources: { ddb } }) => {
      const results = await Promise.all(
        Array.from(parent.parentIds ?? []).map(
          async (id) => await ddb.getConceptById(id)
        )
      );
      return results;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// This final export is important!

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async () => ({
      dataSources: {
        ddb: new DynamoDataSource(),
      },
    }),
  }
);
