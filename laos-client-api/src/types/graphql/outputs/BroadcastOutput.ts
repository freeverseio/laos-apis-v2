import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class BroadcastResponse {
  @Field()
  tokenId!: string;

  @Field()
  success!: boolean;
}

@ObjectType()
export class BroadcastBatchResponse {
  
  @Field(() => [String], { nullable: true })
  tokenIds!: string[];

  @Field()
  success!: boolean;
}