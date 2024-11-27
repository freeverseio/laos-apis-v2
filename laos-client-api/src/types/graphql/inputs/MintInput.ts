import { InputType, Field } from "type-graphql";

@InputType()
export class AttributeInput {
  @Field({ nullable: false })
  trait_type!: string;

  @Field({ nullable: false })
  value!: string;
}

@InputType()
class TokenInput {
  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [AttributeInput], { nullable: true })
  attributes?: AttributeInput[];

  @Field({ nullable: true })
  image?: string;

  @Field(() => [String], { nullable: false })
  mintTo!: string[];
}

@InputType()
export class MintInput {
  @Field({ nullable: false })
  chainId!: string;

  @Field({ nullable: false })
  contractAddress!: string;

  @Field(() => [TokenInput], { nullable: false })
  tokens!: TokenInput[];
}