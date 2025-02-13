import { Resolver, Ctx, Mutation, Arg } from "type-graphql";
import { BroadcastingService } from "../services/BroadcastingService";
import { BroadcastBatchInput, BroadcastInput } from "../types/graphql/inputs/BroadcastInput";
import { BroadcastResponse, BroadcastBatchResponse } from "../types/graphql/outputs/BroadcastOutput";

interface Context {
  headers: any;
}

@Resolver()
export class BroadcastResolver {
  constructor(private broadcastService: BroadcastingService) {}

  @Mutation(() => BroadcastResponse)
  async broadcast(@Arg("input") input: BroadcastInput, @Ctx() context: Context): Promise<BroadcastResponse> {
    let apiKey = context.headers.headersInit['x-api-key'];
    if (!apiKey) {
      throw new Error("x-api-key header must be informed.")
    }
    //remove the API-KEY prefix
    apiKey = apiKey.replace('API-KEY ', '');
    return this.broadcastService.broadcast(input, apiKey);
  }
  @Mutation(() => BroadcastBatchResponse)
  async broadcastBatch(@Arg("input") input: BroadcastBatchInput, @Ctx() context: Context): Promise<BroadcastBatchResponse> {
    let apiKey = context.headers.headersInit['x-api-key'];
    //remove the API-KEY prefix
    apiKey = apiKey.replace('API-KEY ', '');
    return this.broadcastService.broadcastBatch(input, apiKey);
  }


}
