import { 
    BlockHeader, 
    DataHandlerContext, 
    EvmBatchProcessor, 
    EvmBatchProcessorFields, 
    Log as _Log, 
    Transaction as _Transaction 
} from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import * as ERC721UniversalContract from '../abi/UniversalContract'
import * as ERC721UniversalContract2 from '../abi/UniversalContract2' // added Name, Symbol to NewERC721Universal

export const processor = new EvmBatchProcessor()
    .setGateway(process.env.GATEWAY_ENDPOINT!)
    .setRpcEndpoint({
      url: process.env.RPC_ENDPOINT!,
      capacity: 10,
      ...(process.env.MAX_BATCH_CALL_SIZE_OWNERSHIP ? { maxBatchCallSize: Number(process.env.MAX_BATCH_CALL_SIZE_OWNERSHIP) } : {}),
      ...(process.env.RPC_RATE_LIMIT_OWNERSHIP ? { rateLimit: Number(process.env.RPC_RATE_LIMIT_OWNERSHIP) } : {}),
      requestTimeout: 15_000,
    })
    .setFinalityConfirmation(200)
    .setBlockRange({
        from: Number(process.env.STARTING_BLOCK_OWNERSHIP),        
    })
    .addLog({
       topic0: [ ERC721UniversalContract.events.NewERC721Universal.topic, ERC721UniversalContract2.events.NewERC721Universal.topic, ERC721UniversalContract.events.Transfer.topic]
    })
    .setFields({
        log: {
            transactionHash: true
        }
    });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
