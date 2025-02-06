export interface BaseLaosAsset {
    id: string
    laosContract: string
    tokenId: bigint
    initialOwner: string
    createdAt: Date
    logIndex: number
    metadata: string | undefined | null
}

export interface BaseMetadata {
    id: string
    laosAsset: BaseLaosAsset
    tokenUri: BaseTokenUri
    blockNumber: number
    timestamp: Date
    txHash: string
}

export interface BaseTokenUri {
    id: string
    state: string
    name: string | undefined | null
    description: string | undefined | null
    image: string | undefined | null
}
