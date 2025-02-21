# laos-indexer-api

This code provides an indexer that tracks all NFTs minted on any EVM chain using LAOS Network's bridgeless minting technology.

For example, the indexer can track NFTs created on Ethereum using LAOS. In this scenario, asset ownership and trading remain on Ethereum, while the gas costs for minting are offloaded to the LAOS Network.

In such example, developers using this indexer retrieve NFT data as usual, as if all NFTs were assets regularly created on Ethereum, 
with the use of LAOS being entirely transparent.

The code is a minimal extension of Subsquid's framework, leveraging its multi-chain indexing feature to track events on both the EVM chain and the LAOS Network.

A custom GraphQL API is provided for real-time data retrieval.

## Quickstart with Laos Mainnet

1. **Specify the Laos chain** where minting will operate, e.g. Mainnet, Sigma, etc., by creating an `.env` file.
   - Use `example.env` as a reference.
   - Provide the appropriate RPC endpoint, e.g. `RPC_LAOS_ENDPOINT=https://laos-mainnet.com`.

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


## Using a different chain

1. **Specify the Laos chain** where minting will operate, e.g. Mainnet, Sigma, etc., by creating an `.env` file.
   - Use `example.env` as a reference.
   - Provide the appropriate RPC endpoint, e.g. `RPC_LAOS_ENDPOINT=https://laos-mainnet.com`.
   - adapt the following env vars :
     - PRIVATE_IPFS_GATEWAY=https://gateway.pinata.cloud
     - LAOS_GLOBAL_CONSENSUS=0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f
     - LAOS_PARACHAIN=4006
     - LAOS_PALLET_INSTANCE=51
     - STARTING_BLOCK_LAOS=1093010
     - STARTING_BLOCK_OWNERSHIP=65109700

2. **Generte the schema.graphql file**

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


4. **Generate migration file**

```bash
sqd migration:generate
```

5. **Start the processor**


```bash
sqd run .
```







## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

## License
This project is licensed under the MIT License. 