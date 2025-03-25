import { InputType, Field, Int } from 'type-graphql';
import { Min, Max, IsNotEmpty } from "class-validator";

@InputType()
 class PaginationInput {
  @Field(() => Int, { nullable: false })
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  limit!: number;

  @Field(() => Int, { nullable: false, defaultValue: 0 })
  offset: number = 0;
}

@InputType()
export class TokenPaginationInput  {
  @Field(() => Int, { nullable: false })
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  first!: number ;

  @Field(() => String, { nullable: true })
  after?: string;  
}
