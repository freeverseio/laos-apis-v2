import "reflect-metadata";
import { JsonController, Body, Post, Req, Res } from "routing-controllers";
import { Request, Response } from "express";
import { TokenSupplyInput, GetTokenBalancesInput, TokenSuppliesResponse, TokenBalancesResponse } from "../types";
import { TokenServiceFactory } from "../factories/TokenServiceFactory";
import { TokenService } from "../services/TokenService";

@JsonController("/token")
export class TokenController {

  private tokenService: TokenService;

  constructor() {
    this.tokenService = TokenServiceFactory.createTokenService();
  }

  @Post("/GetTokenSupplies")
  async getTokenSupplies(@Body({ validate: true }) body: TokenSupplyInput): Promise<TokenSuppliesResponse> {
    try {
      const result = await this.tokenService.getTokenSupplies(body);
      return result;
    } catch (error: any) {
      console.error("Error in getTokenSupplies:", error.message);
      throw new Error("Internal server error");
    }
  }

  @Post("/GetTokenBalances")
  async getTokenBalances(@Body({ validate: true }) body: GetTokenBalancesInput): Promise<TokenBalancesResponse> {
    try {
      const result = await this.tokenService.getTokenBalances(body);
      return result;
    } catch (error: any) {
      console.error("Error in getTokenBalances:", error.message);
      throw new Error("Internal server error");
    }
  }
}
