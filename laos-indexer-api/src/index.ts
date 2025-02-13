import "reflect-metadata";
import * as dotenv from 'dotenv';
import { buildSchema } from "type-graphql";
import { TokenResolver } from "./resolvers/TokenResolver";
import Database from "./services/db/Database";
import { TransferResolver } from "./resolvers/TransferResolver";
import { TokenHistoryResolver } from "./resolvers/TokenHistoryResolver";
import Config from "./config/config";
import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';

dotenv.config();

async function startServer() {

  await Config.loadConfig();
  console.log('Supported Chains Loaded:', Config.getSupportedChains());
  console.log('Supported LAOS Chains Loaded:', Config.getSupportedLaosChains());
  console.log('Default Ownership LAOS Chain Loaded:', Config.getDefaultOwnershipLaosChain());

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

    const gatewayApp = createYoga({
      schema,
      context: ({ req }: { req: any }) => {
        return {
          headers: req.headers,
        };
      },
      graphqlEndpoint: '/',
      maskedErrors: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
      graphiql: {
        title: 'Laos Indexer API',
      },
    });
  
  
    const server = createServer(gatewayApp);
    server.listen(process.env.GQL_PORT, () => console.log(`Gateway running at http://localhost:${process.env.GQL_PORT}/`));
}

startServer();