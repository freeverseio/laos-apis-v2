import { Context } from '../processor';
import * as ERC721UniversalContract from '../../abi/UniversalContract';
import * as ERC721UniversalContract2 from '../../abi/UniversalContract2';
import { parseBaseURI } from '../util';
import { v4 as uuidv4 } from 'uuid';
import { RawTransfer, DetectedEvents, RawOwnershipContract } from '../../model';
import { BlockData } from '@subsquid/evm-processor';
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export class EventDetectionService {
  private ctx: Context;
  private ownershipContractsToCheck: Set<string>;

  constructor(ctx: Context, ownershipContractsToCheck: Set<string>) {
    this.ctx = ctx;
    this.ownershipContractsToCheck = ownershipContractsToCheck;
  }

  public async detectEvents(): Promise<DetectedEvents> {
    const transfers: RawTransfer[] = [];
    const ownershipContractsToInsertInDb: RawOwnershipContract[] = [];
    for (const block of this.ctx.blocks) {
      for (const log of block.logs) {
        await this.detectNewERC721Universal(log, ownershipContractsToInsertInDb);
        this.detectTransfer(log, transfers, block.header.timestamp, block.header.height);
      }
    }

    return { transfers, ownershipContracts: ownershipContractsToInsertInDb };
  }

  private async detectNewERC721Universal(log: any, ownershipContractsToInsertInDb: RawOwnershipContract[]): Promise<void> {
    let universalContractVersion = 0;
    let logDecoded: any = null;
    if (log.topics[0] === ERC721UniversalContract.events.NewERC721Universal.topic) {
      universalContractVersion = 1;
      logDecoded = ERC721UniversalContract.events.NewERC721Universal.decode(log);
    } else if (log.topics[0] === ERC721UniversalContract2.events.NewERC721Universal.topic){
      universalContractVersion = 2;
      logDecoded = ERC721UniversalContract2.events.NewERC721Universal.decode(log);
    }
    if (logDecoded) {      
      console.log('New ERC721 Universal contract detected:', logDecoded.newContractAddress);
      this.ownershipContractsToCheck.add(logDecoded.newContractAddress.toLowerCase());
      const baseURITokens = parseBaseURI(logDecoded.baseURI);
      if (baseURITokens === null) return // If the baseURI is not valid, skip the ERC721Universal contract
      const laosContractAddress = baseURITokens?.accountKey20 ? baseURITokens.accountKey20.toLowerCase() : null;

      const bytecodeHash = await this.getBytecodeHash(logDecoded);
      let name = null;
      let symbol = null;
      if (universalContractVersion === 2) {
        name = logDecoded.name;
        symbol = logDecoded.symbol;
      }

      ownershipContractsToInsertInDb.push({
        id: logDecoded.newContractAddress.toLowerCase(),
        laosContract: laosContractAddress,
        bytecodeHash: bytecodeHash,
        name: name,
        symbol: symbol,
      });
    }
  }

  private async getBytecodeHash(logDecoded: { readonly newContractAddress: string; readonly baseURI: string; }) {
    let bytecodeHash: string | null = null;
    try {
      const provider = new JsonRpcProvider(process.env.RPC_ENDPOINT);
      const bytecode = await provider.getCode(logDecoded.newContractAddress);
      bytecodeHash = ethers.keccak256(bytecode);
      console.log('Contract Bytecode Hash:', bytecodeHash);
    } catch (error) {
      console.error('Error retrieving contract bytecode for address:', logDecoded.newContractAddress, 'Error:', error);
    }
    return bytecodeHash;
  }

  private detectTransfer(log: any, transfers: RawTransfer[], timestamp: number, blockNumber: number): void {
    if (this.ownershipContractsToCheck.has(log.address.toLowerCase()) && log.topics[0] === ERC721UniversalContract.events.Transfer.topic) {
      const logDecoded = ERC721UniversalContract.events.Transfer.decode(log);
      console.log('Transfer detected:', logDecoded);
      const { from, to, tokenId } = logDecoded;
      transfers.push({
        id: uuidv4(),
        tokenId,
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        txHash: log.transactionHash,
        ownershipContract: log.address.toLowerCase(),
      });
    }
  }
}
