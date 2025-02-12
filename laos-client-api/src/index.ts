import "reflect-metadata";
import * as dotenv from 'dotenv';
import cron from 'node-cron';
import { buildSchema } from "type-graphql";
import { MintResolver } from "./resolvers/MintResolver";
import { MintingService } from "./services/MintingService"; 
import { EvolveResolver } from "./resolvers/EvolveResolver";
import { EvolvingService } from "./services/EvolvingService";
import { BroadcastResolver } from "./resolvers/BroadcastResolver";
import { BroadcastingService } from "./services/BroadcastingService";
import { CreateCollectionResolver } from "./resolvers/CreateCollection";
import { CreateCollectionService } from "./services/CreateCollectionService";
import { IPFSService } from "./services/ipfs/IPFSService";
import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';
import { stitchSchemas } from '@graphql-tools/stitch';
import fetch from "cross-fetch";
import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';

dotenv.config();

async function createRemoteSchema(uri: string) {
  return await loadSchema(uri, {
    loaders: [new UrlLoader()],
    fetch,
  });
}

async function startServer() {
  const ipfsService = new IPFSService(process.env.PINATA_API_KEY!, process.env.PINATA_API_SECRET!);

  const localSchema = await buildSchema({
    resolvers: [MintResolver, EvolveResolver, BroadcastResolver, CreateCollectionResolver],
    container: {
      get(someClass: any) {
        if (someClass === BroadcastResolver) {
          return new BroadcastResolver(new BroadcastingService());
        } else if (someClass === MintResolver) {
          return new MintResolver(new MintingService());
        } else if (someClass === EvolveResolver) {
          return new EvolveResolver(new EvolvingService());
        } else if (someClass === CreateCollectionResolver) {
          return new CreateCollectionResolver(new CreateCollectionService());
        }
        return undefined;
      },
    },
    validate: true,
  });

  const remoteSchema = await createRemoteSchema(process.env.REMOTE_SCHEMA || 'laos-indexer-api.indexers.svc.cluster:4001');

  const mergedSchema = stitchSchemas({
    subschemas: [localSchema, remoteSchema],
  });

  const yogaApp = createYoga({
    schema: mergedSchema,
    context: ({ request }: { request: any }) => ({
      headers: request.headers,
    }),
    graphqlEndpoint: '/',
    maskedErrors: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });

  const server = createServer(yogaApp);

  server.listen(4001, () => {
    console.log(`🚀 Server running at http://localhost:4001/`);

    cron.schedule('0 * * * *', () => { 
      console.log('🔄 Running periodic job every hour'); 
      ipfsService.retryFailedIpfsUploads();
    });
  });
}

startServer();