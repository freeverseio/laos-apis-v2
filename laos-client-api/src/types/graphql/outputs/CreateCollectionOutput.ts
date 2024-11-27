import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class CreateCollectionResponse {  
  @Field()
  chainId!: string;
  
  @Field()
  name!: string;

  @Field()
  symbol!: string;

  @Field()
  contractAddress!: string;

  @Field()
  laosAddress!: string;

  @Field()
  batchMinterAddress!: string;

  @Field()
  success!: boolean;
}