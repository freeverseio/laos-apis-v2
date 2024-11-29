import { GetTokenBalancesInput, TokenSupplyInput } from '../types/rest/input/token';
import { TokenSuppliesResponse, TokenBalancesResponse } from '../types/token';
import { TokenQuery } from './graphql/TokenQuery';
import { TokenMapper } from './mapper/TokenMapper';

export class TokenService {
  
  private tokenQuery: TokenQuery;
  
  constructor(tokenQuery: TokenQuery) {
    this.tokenQuery = tokenQuery;
  }

  public async getTokenSupplies(body: TokenSupplyInput): Promise<TokenSuppliesResponse> {
    const response = await this.tokenQuery.fetchTokens(body);
    const mappedTokens = TokenMapper.mapTokenSupplies(response, body, 137, body.contractAddress);
    return mappedTokens;
  }

  public async getTokenBalances(body: GetTokenBalancesInput): Promise<TokenBalancesResponse> {
    const response = await this.tokenQuery.fetchTokensByOwner(body);
    const mappedTokens = TokenMapper.mapTokenBalances(response, body, 137);
    return mappedTokens;
  }
}

