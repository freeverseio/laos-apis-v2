import { ApolloClient, DocumentNode, InMemoryCache, QueryOptions, gql } from '@apollo/client/core';


export class GqlClient {
  private readonly client: ApolloClient<any>
  constructor() {
    this.client = new ApolloClient({
      uri: process.env.GRAPHQL_ENDPOINT!,
      cache: new InMemoryCache(),
    });
  }

  public async query(options: QueryOptions<any, any>): Promise<any> {
    return this.client.query(options);
  }
}
