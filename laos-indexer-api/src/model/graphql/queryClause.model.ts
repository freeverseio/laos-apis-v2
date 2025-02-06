import { Field, InputType } from 'type-graphql';

@InputType()
export class TransferWhereInput {

  @Field({ nullable: false })
  chainId!: string;

  @Field({ nullable: true })
  laosChainId?: string;

  @Field({ nullable: true })
  tokenId?: string;

  @Field({ nullable: true })
  contractAddress?: string;

  @Field({ nullable: true })
  to?: string;

  @Field({ nullable: true })
  from?: string;

  @Field({ nullable: true, name: 'to_startsWith' })
  to_startsWith?: string;
}

@InputType()
export class TokenWhereInput {

  @Field({ nullable: false })
  chainId!: string;

  @Field({ nullable: true })
  laosChainId?: string;

  @Field({ nullable: true })
  contractAddress?: string;

  @Field({ nullable: true })
  owner?: string;

  @Field({ nullable: true })
  laosContract?: string;

  @Field({ nullable: true })
  tokenId?: string;
}

@InputType()
export class TokenOwnersWhereInput {

  @Field({ nullable: false })
  chainId!: string;

  @Field({ nullable: true })
  laosChainId?: string;
  
  @Field({ nullable: true })
  laosContract?: string;

  @Field({ nullable: true })
  contractAddress?: string;

  @Field({ nullable: true })
  tokenId?: string;

  @Field({ nullable: true })
  owner?: string;
}