import "reflect-metadata";
import * as dotenv from 'dotenv';
import { buildSchema } from "type-graphql";
import { TokenResolver } from "./resolvers/TokenResolver";
import Database from "./services/db/Database";
import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';

dotenv.config();

async function startServer() {

  const tx = async (query: string, params?: any[]): Promise<any[]> => {
    const result = await Database.query(query, params);
    return result.rows;
  };

  const schema = await buildSchema({
    resolvers: [TokenResolver],
    container: {
      get(someClass: any) {
        if (someClass === TokenResolver) {
          return new TokenResolver(tx);
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