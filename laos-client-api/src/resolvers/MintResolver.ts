import { Resolver, Query, Mutation, Arg, Ctx  } from "type-graphql";
import { MintingService } from "../services/MintingService";
import { MintInput } from "../types/graphql/inputs/MintInput";
import { MintResponse } from "../types/graphql/outputs/MintOutput";

interface Context {
  headers: any;
}
@Resolver()
export class MintResolver {
  constructor(private mintingService: MintingService) {}

  @Query(() => String)
  async status() {
    return "Up";
  }

  @Mutation(() => MintResponse)
  async mint(@Arg("input") input: MintInput, @Ctx() context: Context): Promise<MintResponse> {
    let apiKey = context.headers['authorization'];
    //remove the API-KEY prefix
    apiKey = apiKey.replace('API-KEY ', '');
    return this.mintingService.mint(input, apiKey);
  }
}
