import { IsString, IsBoolean, IsOptional, IsArray, IsObject, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

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
  includeCollectionTokens: boolean = true;

}

export class TokenSupplyInput {
  @IsString()
  @IsNotEmpty()
  contractAddress!: string;

  @IsBoolean()
  includeMetadata!: boolean;
}