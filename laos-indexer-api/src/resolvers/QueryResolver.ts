import { Resolver, Query, Mutation, Arg, Ctx  } from "type-graphql";

interface Context {
  headers: any;
}
@Resolver()
export class QueryResolver {
  //constructor(private mintingService: MintingService) {}
  constructor() {}

  @Query(() => String)
  async status() {
    return "Up";
  }

  // @Query(() => MintStatusResponse)
  // async mintResponse(@Arg("txHash") txHash: string): Promise<MintStatusResponse> {
  //   return this.mintingService.mintResponse(txHash);
  // }
}