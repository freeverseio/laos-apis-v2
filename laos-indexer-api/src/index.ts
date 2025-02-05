import "reflect-metadata";
import * as dotenv from 'dotenv';
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { TokenResolver } from "./resolvers/TokenResolver";
import Database from "./services/db/Database";
import { TransferResolver } from "./resolvers/TransferResolver";
import { TokenHistoryResolver } from "./resolvers/TokenHistoryResolver";
import Config from "./config/config";

dotenv.config();

async function startServer() {

  await Config.loadConfig();
  console.log('Supported Chains Loaded:', Config.getSupportedChains());
  console.log('Supported LAOS Chains Loaded:', Config.getSupportedLaosChains());

  const tx = async (query: string, params?: any[]): Promise<any[]> => {
    const result = await Database.query(query, params);
    return result.rows;
  };

  const schema = await buildSchema({
    resolvers: [TokenResolver, TransferResolver, TokenHistoryResolver],
    container: {
      get(someClass: any) {
        if (someClass === TokenResolver) {
          return new TokenResolver(tx);
        } else if (someClass === TransferResolver) {
          return new TransferResolver(tx);
        } else if (someClass === TokenHistoryResolver) {
          return new TokenHistoryResolver(tx);
        }
        return undefined;
      },
    },
    validate: true,
  });

  const server = new ApolloServer({
    schema,
    introspection: true, // Enables introspection of the schema
    plugins: [
    ],
    context: ({ req }: { req: any }) => {
      return {
        headers: req.headers,
      };
    },
  });

  server.listen({ port: process.env.GQL_PORT }).then(({ url }: { url: string }) => {
    console.log(`Server ready at ${url}`);
    
  });
}

startServer();