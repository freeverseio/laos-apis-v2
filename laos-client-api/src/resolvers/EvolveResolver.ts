
import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { EvolvingService } from "../services/EvolvingService";
import { EvolveInput } from "../types/graphql/inputs/EvolveInput";
import { EvolveResponse, EvolveAsyncResponse, EvolveStatusResponse } from "../types/graphql/outputs/EvolveOutput";
interface Context {
  headers: any;
}

@Resolver()
export class EvolveResolver {
  constructor(private evolvingService: EvolvingService) {}


  @Mutation(() => EvolveResponse)
  async evolve(@Arg("input") input: EvolveInput, @Ctx() context: Context): Promise<EvolveResponse> {
    let apiKey = context.headers.headersInit['x-api-key'];
    if (!apiKey) {
      throw new Error("x-api-key header must be informed.")
    }

    //remove the API-KEY prefix
    apiKey = apiKey.replace('API-KEY ', '');
    return this.evolvingService.evolveBatch(input, apiKey);
  }

  @Mutation(() => EvolveAsyncResponse)
  async evolveAsync(@Arg("input") input: EvolveInput, @Ctx() context: Context): Promise<EvolveAsyncResponse> {
    let apiKey = context.headers.headersInit['x-api-key'];
    if (!apiKey) {
      throw new Error("x-api-key header must be informed.")
    }
    //remove the API-KEY prefix
    apiKey = apiKey.replace('API-KEY ', '');
    return this.evolvingService.evolveBatchAsync(input, apiKey);
  }

  @Query(() => EvolveStatusResponse)
  async evolveResponse(@Arg("txHash") txHash: string): Promise<EvolveStatusResponse> {
    return this.evolvingService.evolveBatchResponse(txHash);
  }
}
