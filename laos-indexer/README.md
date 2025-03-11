# laos-indexer

This code provides an indexer that tracks all NFTs minted and evolved on the LAOS Network. 
Within the umbrella of Bridgeless Minting, this component is needed alongside an instance of at least one indexer of an *ownership chain* (e.g. Ethereum, Polygon), for which the code is [here](../laos-ownership-indexer/).

The code is a minimal extension of Subsquid's framework, leveraging its multi-chain indexing feature to track events on both the EVM chain and the LAOS Network.

A custom GraphQL API is provided for real-time data retrieval.

## Setting up

1. **Select either LAOS Mainnet or Testnet** where minting will operate by creating an `.env` file.
   - Use [example.env](./example.env) as a reference.
   - Set the appropriate RPC endpoint, e.g. `RPC_LAOS_ENDPOINT=https://rpc.laos.laosfoundation.io`.
   - Set your preferred IPFS Gateway, e.g.:
      - `PRIVATE_IPFS_GATEWAY=https://subsquid-laos.mypinata.cloud/ipfs/`
      - `PRIVATE_IPFS_GATEWAY_API_KEY=abc...123`

2. **Execute the following commands**:

```bash
# 1. Install @subsquid/cli globally (sqd command)
npm i -g @subsquid/cli@2.12.x

# 2. Install dependencies
npm ci

# 3. Clean previous processes
sqd clean:all

# 4. Build and start the processor
sqd run .
```

A GraphQL playground will be available at http://localhost:4350/graphql.

2. **Generating schema**

Upon changes on your configuration, you can regenerate the graphql schema via:
```bash
sqd generate:schema
```
or
```bash
node generateSchema.js --chainName=Mainnet
```

3. **Build orm entities**

```bash
sqd codegen
sqd clean:all
```


4. **Move migration file**

```bash
mv db/migrations/* migrations/db/migrations/
```

5. **Go to migrations folder and run migrations**

```bash
cd migrations
npx ts-node db/migrations/index.ts
```


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

## License
This project is licensed under the MIT License. 