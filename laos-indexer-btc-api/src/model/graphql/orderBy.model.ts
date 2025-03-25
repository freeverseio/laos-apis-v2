import { registerEnumType } from 'type-graphql';

export interface IOrderByOptions {
  field: string;
  direction: 'ASC' | 'DESC';
}

export enum TokenOrderByOptions {
  CREATED_AT_ASC = 'created_at ASC',
  CREATED_AT_DESC = 'created_at DESC',
}

// Register AssetOrderByOptions
registerEnumType(TokenOrderByOptions, {
  name: 'TokenOrderByOptions',
  description: 'Possible options for ordering tokens',
});


export type OrderByOptions = TokenOrderByOptions;