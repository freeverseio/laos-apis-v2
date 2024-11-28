import "reflect-metadata";
import { JsonController, Body, Post, Req, Res } from "routing-controllers";
import { getTokenSupplies, getTokenBalances } from "../services/tokenService";
import { Request, Response } from "express";
import { TokenSupplyInput, GetTokenBalancesInput } from "../types";

@JsonController("/token")
export class TokenController {
  
  @Post("/GetTokenSupplies")
  async getTokenSupplies(@Body({ validate: true }) body: TokenSupplyInput) {
    try {
      const { contractAddress, includeMetadata } = body;
      const result = await getTokenSupplies(contractAddress, includeMetadata);
      return result;
    } catch (error: any) {
      console.error("Error in getTokenSupplies:", error.message);
      throw new Error("Internal server error");
    }
  }

  @Post("/GetTokenBalances")
  async getTokenBalances(@Body({ validate: true }) body: GetTokenBalancesInput) {
    try {
      const {  accountAddress, includeMetadata } = body;
      const result = await getTokenBalances(accountAddress, includeMetadata);
      return result;
    } catch (error: any) {
      console.error("Error in getTokenBalances:", error.message);
      throw new Error("Internal server error");
    }
  }
}
