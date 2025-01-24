import "reflect-metadata";
import * as dotenv from 'dotenv';
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { QueryResolver } from "./resolvers/QueryResolver";
// import { MintingService } from "./services/MintingService"; 
// import { EvolveResolver } from "./resolvers/EvolveResolver";
// import { EvolvingService } from "./services/EvolvingService";
// import { BroadcastResolver } from "./resolvers/BroadcastResolver";
// import { BroadcastingService } from "./services/BroadcastingService";
// import { CreateCollectionResolver } from "./resolvers/CreateCollection";
// import { CreateCollectionService } from "./services/CreateCollectionService";

dotenv.config();

async function startServer() {
  const schema = await buildSchema({
    resolvers: [QueryResolver],
    container: {
      get(someClass: any) {
        if (someClass === QueryResolver) {
          return new QueryResolver();       
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

  server.listen({ port: 4001 }).then(({ url }: { url: string }) => {
    console.log(`Server ready at ${url}`);
    
  });
}

startServer();