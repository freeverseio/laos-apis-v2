-- Create the CLIENT table
CREATE TABLE api_client (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    key VARCHAR(255) UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);


-- Create the api_contract table
CREATE TABLE api_contract (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    chain_id VARCHAR(255) NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    laos_contract VARCHAR(255) NOT NULL,
    batch_minter_contract VARCHAR(255),
    FOREIGN KEY (client_id) REFERENCES api_client(id)
);

-- Create a unique constraint on the combination of client_id, chain_id, and contract_address
ALTER TABLE api_contract ADD CONSTRAINT unique_contract 
    UNIQUE (client_id, chain_id, contract_address);

-- Create an index on client_id for faster lookups
CREATE INDEX idx_contract_client_id ON api_contract(client_id);

-- Create an index on client_id, chain_id, and contract_address for faster lookups
CREATE INDEX idx_contract_client_id_chain_id_contract_address ON api_contract(client_id, chain_id, contract_address)