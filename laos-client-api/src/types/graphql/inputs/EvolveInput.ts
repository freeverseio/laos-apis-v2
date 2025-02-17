import { InputType, Field } from "type-graphql";
import { AttributeInput } from "./MintInput";




@InputType()
export class EvolveInput {
  @Field({ nullable: false })
  chainId?: string;

  @Field({ nullable: false })
  contractAddress?: string;

  @Field(() => [TokenEvolveInput], { nullable: false })
  tokens!: TokenEvolveInput[];
}

@InputType()
class TokenEvolveInput {
  
  @Field({ nullable: false })
  tokenId!: string;

  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [AttributeInput], { nullable: true })
  attributes?: AttributeInput[];

  @Field({ nullable: true })
  image?: string;

}