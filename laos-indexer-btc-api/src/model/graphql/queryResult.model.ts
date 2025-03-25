import { ObjectType, Field } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true })
  endCursor?: string;

  @Field(() => Boolean, { nullable: true })
  hasNextPage?: boolean;

  @Field(() => Boolean, { nullable: true })
  hasPreviousPage?: boolean;

  @Field(() => String, { nullable: true })
  startCursor?: string;

  constructor(props: Partial<PageInfo>) {
    Object.assign(this, props);
  }
}

@ObjectType()
export class TokenQueryResult {
  @Field(() => String, { nullable: false })
  tokenId!: string;

  @Field(() => String, { nullable: false })
  laosContract!: string;

  @Field(() => String, { nullable: false })
  owner!: string;

  @Field(() => String, { nullable: true })
  tokenUri!: string | null;

  @Field(() => String, { nullable: true })
  tokenUriFetchState!: string;
  
  // internal field for cursor
  contractAddress!: string | null;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => String, { nullable: false })
  initialOwner!: string;

  @Field(() => String, { nullable: true })
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string;

  @Field(() => String, { nullable: true })
  image!: string | null;

  @Field(() => GraphQLJSON, { nullable: true })
  attributes!: Record<string, any> | null;

  @Field(() => Number, { nullable: false })
  block_number!: number;

  constructor(props: Partial<TokenQueryResult>) {
    Object.assign(this, props);
  }
}

@ObjectType()
export class TokenQueryResultSelect extends TokenQueryResult {     

  @Field(() => Number, { nullable: false })
  logIndex!: number;

  constructor(props: Partial<TokenQueryResultSelect>) {
    super(props);
    Object.assign(this, props);
  }
}


@ObjectType()
export class TokenEdge {
  @Field(() => String)
  cursor!: string;

  @Field(() => TokenQueryResult)
  node!: TokenQueryResult;

  constructor(cursor: string, node: TokenQueryResult) {
    this.cursor = cursor;
    this.node = node;
  }
}

@ObjectType()
export class TokenConnection {
  @Field(() => [TokenEdge])
  edges!: TokenEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;

  @Field(() => Number, { nullable: false })
  totalCount!: number;

  constructor(edges: TokenEdge[], pageInfo: PageInfo, totalCount: number) {
    this.edges = edges;
    this.pageInfo = pageInfo;
    this.totalCount = totalCount;
  }
}

@ObjectType()
export class TokenOwnersQueryResult {

  @Field(() => String, { nullable: false })
  owner!: string;

  @Field(() => String, { nullable: true })
  initialOwner?: string;

  constructor(props: Partial<TokenOwnersQueryResult>) {
    Object.assign(this, props);
  }
}

@ObjectType()
export class CollectionsQueryResult {

  @Field(() => String, { nullable: false })
  id?: string;

  @Field(() => String, { nullable: true })
  laosContractAddress?: string;
  
  @Field(() => Boolean, { nullable: true })
  rebaseable?: boolean;  

  constructor(props: Partial<CollectionsQueryResult>) {
    Object.assign(this, props);
  }
}