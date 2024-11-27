import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class MintResponse {
  @Field(() => Int, { nullable: false })
  numberOfTokens!: number;

  @Field(() => [String], { nullable: false })
  tokenIds!: string[];

  @Field()
  success!: boolean;
}