import { ObjectType, Field } from "type-graphql";

// Define GraphQL Object Types
@ObjectType()
export class Chain {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  chainId!: string;
}

@ObjectType()
export class LaosChain {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  laosChainId!: string;
}

@ObjectType()
export class SupportedChainsResponse {
  @Field(() => [Chain], { nullable: false })
  ownershipChains!: Chain[];

  @Field(() => [LaosChain], { nullable: false })
  laosChains!: LaosChain[];
}