import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { MintResolver } from '../resolvers/MintResolver';

export async function startTestServer(mockMintingService: any) {
  const schema = await buildSchema({
    resolvers: [MintResolver],
    // Manually inject the resolver with the mocked service
    container: {
      get(someClass: any) {
        if (someClass === MintResolver) {
          return new MintResolver(mockMintingService);
        }
        return undefined;
      },
    },
  });

  const server = new ApolloServer(
    { schema, 
      //context: ({ req }) => ({ headers: req.headers }) 
      context: ({ req }) => {
        return {
          headers: {
            ...req.headers,
            headersInit: req.headers // This line maps all headers to headersInit
          }
        };
      }
    });

  const { url } = await server.listen({ port: 0 }); // Use port 0 to get a random available port
  return { server, url };
}
