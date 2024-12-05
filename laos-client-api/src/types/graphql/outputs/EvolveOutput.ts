import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class EvolveResponse {
  @Field()
  tokenId!: string;

  @Field()
  success!: boolean;

  @Field()
  tokenUri!: string;

  @Field()
  tx!: string;
}

@ObjectType()
export class EvolveBatchResponse {

  @Field()
  success!: boolean;

  @Field()
  tx!: string;

  @Field(() => [EvolveTokenResponse])
  tokens!: EvolveTokenResponse[];
}

@ObjectType()
export class EvolveTokenResponse {
  @Field()
  tokenId!: string;

  @Field()
  tokenUri!: string;
}