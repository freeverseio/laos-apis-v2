import "reflect-metadata";
import * as dotenv from 'dotenv';
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { TokenResolver } from "./resolvers/TokenResolver";
import Database from "./services/db/Database";

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