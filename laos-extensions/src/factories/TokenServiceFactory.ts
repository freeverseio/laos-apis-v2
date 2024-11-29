import { TokenQuery } from "../services/graphql/TokenQuery";
import { TokenService } from "../services/TokenService";

export class TokenServiceFactory {
  static createTokenService(): TokenService {
    const tokenQuery = new TokenQuery();
    return new TokenService(tokenQuery);
  }
}
