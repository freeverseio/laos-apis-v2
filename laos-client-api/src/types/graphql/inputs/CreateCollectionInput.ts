import { InputType, Field } from "type-graphql";

@InputType()
export class CreateCollectionInput {
  @Field({ nullable: false })
  chainId!: string;
  
  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: false })
  symbol!: string;

  @Field({ nullable: true })
  laosChainId!: string;
}