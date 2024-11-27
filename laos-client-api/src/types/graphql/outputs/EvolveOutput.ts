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