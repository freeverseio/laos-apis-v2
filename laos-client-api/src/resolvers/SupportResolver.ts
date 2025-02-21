import { Resolver, Query, Mutation, Arg, Ctx  } from "type-graphql";
import { SupportService } from "../services/SupportService";
import { SupportedChainsResponse } from "../types/graphql/outputs/SupportedChanisOutput";

interface Context {
  headers: any;
}
@Resolver()
export class SupportResolver {
  constructor(private supportService: SupportService) {}

  @Query(() => SupportedChainsResponse)
  async supportedChains(): Promise<SupportedChainsResponse> {
    return this.supportService.supportedChains();
  }
}