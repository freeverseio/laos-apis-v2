export interface RawTransfer {
  id: string
  tokenId: bigint
  from: string
  to: string
  timestamp: Date
  blockNumber: number
  txHash: string
  ownershipContract: string
}


export interface DetectedEvents{
  transfers: RawTransfer[]
  ownershipContracts: RawOwnershipContract[]
}


export interface RawOwnershipContract {
  id: string
  laosContract: string | null
  baseUri: string | null
  laosChainId: number | null
  bytecodeHash: string | null
  name: string | null
  symbol: string | null
}
