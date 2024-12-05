
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { EvolvingService } from "../services/EvolvingService";
import { EvolveInput, EvolveBatchInput } from "../types/graphql/inputs/EvolveInput";
import { EvolveResponse, EvolveBatchResponse } from "../types/graphql/outputs/EvolveOutput";
interface Context {
  headers: any;
}

@Resolver()
export class EvolveResolver {
  constructor(private evolvingService: EvolvingService) {}

  @Mutation(() => EvolveResponse)
  async evolve(@Arg("input") input: EvolveInput, @Ctx() context: Context): Promise<EvolveResponse> {
    let apiKey = context.headers['authorization'];
    //remove the API-KEY prefix
    apiKey = apiKey.replace('API-KEY ', '');
    return this.evolvingService.evolve(input, apiKey);
  }

  @Mutation(() => EvolveBatchResponse)
  async evolveBatch(@Arg("input") input: EvolveBatchInput, @Ctx() context: Context): Promise<EvolveBatchResponse> {
    let apiKey = context.headers['authorization'];
    //remove the API-KEY prefix
    apiKey = apiKey.replace('API-KEY ', '');
    return this.evolvingService.evolveBatch(input, apiKey);
  }
}
