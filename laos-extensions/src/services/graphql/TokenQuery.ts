import { ApolloClient, gql, InMemoryCache } from "@apollo/client/core";
import { GqlClient } from "./GqlClient";
import { GetTokenBalancesInput, GetTokenBalancesQueryInput, GetTokenSuppliesQueryInput, SortBy, SortColumn, SortOrder, TokenIndexer, TokenResponse, TokenSupply, TokenSupplyInput } from "../../types";

export class TokenQuery {
  private gqlClient: GqlClient;


  constructor() {
    this.gqlClient = new GqlClient();
  }

  createQueryByOwner(input: GetTokenBalancesQueryInput) {

    let whereClauses = []
    if (input.contractAddress) {
      whereClauses.push(`contractAddress: "${input.contractAddress}"`);
    }
    if (input.owner) {
      whereClauses.push(`owner: "${input.owner}"`);
    }
    if (input.tokenId) {
      whereClauses.push(`tokenId: "${input.tokenId}"`);
    }
    if (input.chainId) {
      whereClauses.push(`chainId: "${input.chainId}"`);
    }

    const whereClauseString = whereClauses.length > 0 ? `{ ${whereClauses.join(", ")} }` : "";
    return gql`
      query MyQuery {
          tokens(
            orderBy: ${input.orderBy || 'CREATED_AT_DESC'}
            pagination: {first: ${input.first} ${input.after ? `, after: "${input.after}"` : ''}}
            ${whereClauseString ? `where: ${whereClauseString}` : ''}
          ) {
            totalCount
            edges {
              cursor
              node {
                tokenId
                contractAddress
                ${input.includeMetadata ? `
                contractName
                contractSymbol
                contractBytecodeHash
                attributes
                block_number
                createdAt
                description
                image
                initialOwner
                name
                owner
                tokenUri
                tokenUriFetchState
                ` : ''}
              }
            }
          }
        }
    `;

  }

  createQueryTokens(input: GetTokenSuppliesQueryInput) {
    return gql`
      query MyQuery {
          tokens(
            where: {
            contractAddress: "${input.contractAddress}"
            chainId: "${input.chainId}"
            }
            orderBy: ${input.orderBy || 'CREATED_AT_DESC'}
            pagination: {first: ${input.first} ${input.after ? `, after: "${input.after}"` : ''}}
          ) {
            totalCount
            edges {
              cursor
              node {
                tokenId         
                ${input.includeMetadata ? `
                attributes
                contractAddress
                contractBytecodeHash
                contractName
                contractSymbol
                block_number
                createdAt
                description
                image
                initialOwner
                name
                owner
                tokenUri
                tokenUriFetchState
                ` : ''}
              }
            }
          }
        }
    `;
  }



  async fetchTokensByOwner(input: GetTokenBalancesInput): Promise<TokenResponse> {
    try {
      const sortBy = this.createSortBy(input.page?.sort || []);
      const query = this.createQueryByOwner({
        ...input,
        chainId: input.chainId,
        owner: input.accountAddress,
        first: input.page?.pageSize ?? 100,
        orderBy: sortBy,
      });
      const response = await this.gqlClient.query({
        query,
        fetchPolicy: 'no-cache',
      });
      const pageSize = input.page?.pageSize ? input.page?.pageSize : 100;
      const tokens: TokenIndexer[] = response.data.tokens.edges.map((edge: any) => {
        return {
          ...edge.node,
          blockNumber: edge.node.block_number,
        }
      });
      if (!response.data || response.data.tokens.edges.length === 0) {
        return {
          page: {
            after: "",
            pageSize: 0,
            more: false,
          },
          tokens: [],
        };
      }
      const after = response.data.tokens.edges[response.data.tokens.edges.length - 1].cursor;
      const totalCount = response.data.tokens.totalCount;
      const more = pageSize === response.data.tokens.edges.length;
      return {
        page: {
          after: after,
          pageSize: pageSize,
          more,
        },
        tokens: tokens,
      };
    } catch (error) {
      console.error('Error fetching token by owner:', error);
      throw new Error('Could not fetch token by owner.');
    }
  }

  async fetchTokens(body: TokenSupplyInput): Promise<TokenResponse> {
    try {
      const sortBy = this.createSortBy(body.page?.sort || []);
      const query = this.createQueryTokens({
        chainId: body.chainId,
        contractAddress: body.contractAddress,
        after: body.page?.after as string | undefined,
        first: body.page?.pageSize ?? 100,
        includeMetadata: body.includeMetadata,
        orderBy: sortBy,
      });
      const response = await this.gqlClient.query({
        query,
        fetchPolicy: 'no-cache',
      });
      if (!response.data || response.data.tokens.edges.length === 0) {
        return {
          page: {
            after: "",
            pageSize: 0,
            more: false,
          },
          tokens: [],
        };
      }
      const pageSize = body.page?.pageSize ? body.page?.pageSize : 100;
      const tokens: TokenIndexer[] = response.data.tokens.edges.map((edge: any) => edge.node);
      const after = response.data.tokens.edges[response.data.tokens.edges.length - 1].cursor;
      const totalCount = response.data.tokens.totalCount;
      const more = pageSize === response.data.tokens.edges.length;
      return {
        page: {
          after: after,
          pageSize: pageSize,
          more,
        },
        tokens: tokens,
      };
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw new Error('Could not fetch tokens.');
    }
  }

  private createSortBy(sortBy: SortBy[]) {
    return sortBy ? sortBy.map((sort) => `${sort.column}_${sort.order}`).join('_') : 'CREATED_AT_DESC';
  }
}
