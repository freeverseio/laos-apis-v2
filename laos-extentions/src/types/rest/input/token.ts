import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

// Enum for sort order
enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// SortBy class
class SortBy {
  @IsString()
  @IsNotEmpty()
  column!: string;

  @IsEnum(SortOrder)
  order!: SortOrder;
}

// Page class
class Page {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsString()
  @IsOptional()
  column?: string;

  @IsOptional()
  before?: object;

  @IsOptional()
  after?: object;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortBy)
  sort?: SortBy[];

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @IsBoolean()
  @IsOptional()
  more?: boolean;
}

class MetadataOptions {
  // You can add specific fields for metadataOptions if needed
  @IsOptional()
  @IsString()
  exampleField?: string;
}

export class GetTokenBalancesInput {

  @IsString()
  @IsNotEmpty()
  accountAddress!: string;

  @IsOptional()
  @IsBoolean()
  includeMetadata: boolean = false;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MetadataOptions) // Use this if you want to add nested validation for metadataOptions
  metadataOptions?: MetadataOptions;

  @IsOptional()
  @IsBoolean()
  verifiedOnly?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeContracts?: string[];

  @IsOptional()
  @IsBoolean()
  includeCollectionTokens?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => Page)
  page?: Page;

}

export class TokenSupplyInput {
  @IsString()
  @IsNotEmpty()
  contractAddress!: string;

  @IsBoolean()
  includeMetadata!: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => Page)
  page?: Page;
}