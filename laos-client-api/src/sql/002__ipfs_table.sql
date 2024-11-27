CREATE TABLE public.api_ipfs_upload (
    id serial4 NOT NULL,
    ipfs_hash varchar(255) NOT NULL,
    status varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    asset_data json, 
    CONSTRAINT api_ipfs_upload_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_ipfs_upload_ipfs_hash ON api_ipfs_upload(ipfs_hash);
CREATE INDEX idx_ipfs_upload_status ON api_ipfs_upload(status);
