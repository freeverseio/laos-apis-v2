export const buildTokenQueryBase = (ownershipPrefix: string, laosPrefix: string, orderByClause: string) => `
  SELECT 
    la.token_id AS "tokenId", 
    COALESCE(a.owner, la.initial_owner) AS "owner",
    la.initial_owner AS "initialOwner",
    la.created_at AS "createdAt", 
    la.log_index AS "logIndex",
    la.laos_contract AS "laosContract",
    m.token_uri_id AS "tokenUri",
    m.block_number,
    m.tx_hash,
    m."timestamp" as "updatedAt",
    tu.state AS "tokenUriFetchState",
    tu.name AS name,
    tu.description AS description,
    tu.image AS image,
    tu.attributes AS attributes,
    oc.id AS "contractAddress",
    oc.name AS "contractName",
    oc.symbol AS "contractSymbol",
    oc.bytecode_hash AS "contractBytecodeHash",
    ROW_NUMBER() OVER (${orderByClause}) AS row_num
  FROM ${laosPrefix}_laos_asset la
  INNER JOIN ${ownershipPrefix}_ownership_contract oc ON LOWER(la.laos_contract) = LOWER(oc.laos_contract)
  INNER JOIN ${laosPrefix}_metadata m ON la.metadata = m.id
  INNER JOIN ${laosPrefix}_token_uri tu ON m.token_uri_id = tu.id
  LEFT JOIN ${ownershipPrefix}_asset a ON la.token_id = a.token_id AND a.ownership_contract_id = oc.id
`;

export const buildTokenCountQueryBase = (ownershipPrefix: string, laosPrefix: string) => `
  SELECT COUNT(*) as count
  FROM ${laosPrefix}_laos_asset la
  INNER JOIN ${ownershipPrefix}_ownership_contract oc ON LOWER(la.laos_contract) = LOWER(oc.laos_contract)
  INNER JOIN ${laosPrefix}_metadata m ON la.metadata = m.id
  INNER JOIN ${laosPrefix}_token_uri tu ON m.token_uri_id = tu.id
  LEFT JOIN ${ownershipPrefix}_asset a ON la.token_id = a.token_id AND a.ownership_contract_id = oc.id
`;

export const buildTokenByIdQuery = (ownershipPrefix: string, laosPrefix: string, laosChainId: string) => `
  WITH contract_data AS (
    SELECT LOWER(laos_contract) AS laos_contract,
    LOWER(id) as ownership_contract,
    laos_chain_id
    FROM ${ownershipPrefix}_ownership_contract
    WHERE LOWER(id) = $1
  )
  SELECT 
    la.token_id AS "tokenId",
    COALESCE(a.owner, la.initial_owner) AS owner,
    la.initial_owner as "initialOwner",
    la.created_at as "createdAt",
    la.laos_contract AS "laosContract",
    m.token_uri_id AS "tokenUri",
    m.block_number,
    m.tx_hash,
    m."timestamp" as "updatedAt",
    tu.state AS "tokenUriFetchState",
    tu.name AS name,
    tu.description AS description,
    tu.image AS image,
    tu.attributes AS attributes,
    cd.ownership_contract as "contractAddress"
  FROM ${laosPrefix}_laos_asset la
  INNER JOIN contract_data cd ON LOWER(la.laos_contract) = cd.laos_contract
  INNER JOIN ${laosPrefix}_metadata m ON la.metadata = m.id
  INNER JOIN ${laosPrefix}_token_uri tu ON m.token_uri_id = tu.id
  LEFT JOIN ${ownershipPrefix}_asset a ON (la.token_id = a.token_id AND LOWER(cd.ownership_contract) = LOWER(a.ownership_contract_id))
  WHERE la.token_id = $2 AND cd.laos_contract IS NOT null AND cd.laos_chain_id = ${laosChainId}
`;

export const buildTokenOwnerQuery = (ownershipPrefix: string, laosPrefix: string) => `
  SELECT DISTINCT 
      COALESCE(a.owner, la.initial_owner) AS owner,
      la.initial_owner AS "initialOwner"
  FROM ${laosPrefix}_laos_asset la
  INNER JOIN ${ownershipPrefix}_ownership_contract oc 
      ON LOWER(la.laos_contract) = LOWER(oc.laos_contract)
  INNER JOIN ${laosPrefix}_metadata m 
      ON la.metadata = m.id
  INNER JOIN ${laosPrefix}_token_uri tu 
      ON m.token_uri_id = tu.id
  LEFT JOIN ${ownershipPrefix}_asset a 
      ON la.token_id = a.token_id 
      AND a.ownership_contract_id = oc.id
  `;

export const buildOwnershipContractsQueryByPrefix = (ownershipPrefix: string) => `
  SELECT id, laos_contract, name, symbol, bytecode_hash, laos_chain_id
  FROM ${ownershipPrefix}_ownership_contract poc
`;
