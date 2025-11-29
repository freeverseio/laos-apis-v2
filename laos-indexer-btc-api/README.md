# Laos Indexer BTC API

API joining BTC indexer data with LAOS EVM data, exposing GraphQL resolvers for tokens, transfers, and token history.

## Features
- GraphQL resolvers using type-graphql
  - tokensByCollection: tokens for a BTC collection via EVM address mapping
  - transfers: ownership transfer events with filtering, ordering, pagination
  - tokenHistory: token metadata history (token URI changes)
- QueryBuilderService composing parameterized SQL for Postgres
- BTC Indexer integration via BtcService (REST)
- Jest test suite with ts-jest

## Project structure
- src/
  - index.ts
  - model/
    - graphql/: GraphQL object and input types
  - services/
    - btc/BtcService.ts: BTC indexer REST client
    - QueryBuilderService.ts: SQL builders
    - queries.ts: SQL fragments
  - resolvers/
    - TokenResolver.ts
    - TransferResolver.ts
    - TokenHistoryResolver.ts
- __tests__/: unit tests

## Requirements
- Node.js 18+
- PostgreSQL (runtime, not needed for unit tests)

## Installation
```
npm ci
```

## Configuration
Environment variables:
- INDEXER_BTC_RPC: Base URL for the BTC indexer HTTP API. Required at runtime by TokenResolver and BtcService.

Local development:
- Create a .env file if needed and export INDEXER_BTC_RPC.

## Scripts
- Build: `npm run build`
- Start (dev): `npm run dev` (nodemon)
- Start: `npm start`
- Test: `npm test`
- Clear Jest cache: `npm run clear_jest`

## Testing
This repo uses Jest with ts-jest.
- Reflect metadata is initialized automatically via jest.setup.ts.
- Tests live under `__tests__/` and cover services and resolvers.

Run tests:
```
npm test
```

## GraphQL summary
- tokensByCollection(where, pagination, orderBy)
  - Fetches collection mapping from BTC indexer, then queries LAOS DB for tokens
  - Cursor-based pagination using first/after
- transfers(where, pagination, orderBy)
  - Chain and optional filters (tokenId, contractAddress, from, to, to_startsWith)
  - Offset/limit pagination
- tokenHistory(chainId, contractAddress, tokenId, laosChainId?, pagination?)
  - Returns metadata updates for a token

## SQL building
QueryBuilderService composes parameterized queries and supports:
- Token queries with cursor pagination (created_at + log_index order)
- Token count queries
- Transfer queries with ordering and pagination
- Token history queries

## Docker
- Dockerfile provided at project root
- .docker/config.json example config

Build image:
```
docker build --platform linux/amd64 -t laos-indexer-btc-api .
```

Run (example):
```
docker run --rm -e INDEXER_BTC_RPC=https://btc-indexer.example.com -p 4000:4000 laos-indexer-btc-api
```

## Notes
- Ensure your DB schema prefixes (e.g., mainnet_) and chain mappings are configured in QueryBuilderService before production use.
- BtcService expects endpoints:
  - GET {INDEXER_BTC_RPC}/collections -> { collections: Array<{ id, evmCollectionAddress, rebaseable }> }
  - GET {INDEXER_BTC_RPC}/collection/:id -> { id, evmCollectionAddress, rebaseable }

## License
ISC
