import { ObjectType, Field } from "type-graphql";



@ObjectType()
export class BroadcastResponse {
  
  @Field(() => [String], { nullable: true })
  tokenIds!: string[];

  @Field()
  success!: boolean;
}