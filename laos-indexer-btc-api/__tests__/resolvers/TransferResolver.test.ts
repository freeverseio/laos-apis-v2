import { TransferResolver } from '../../src/resolvers/TransferResolver';

describe('TransferResolver.transfers', () => {
  const tx = jest.fn();
  let resolver: TransferResolver;

  beforeEach(() => {
    resolver = new TransferResolver(tx);
    // patch internal supported maps
    const svc: any = (resolver as any).queryBuilderService;
    svc.supportedChains = { mainnet: 'mainnet' };
    svc.supportedLaosChains = { '100': 'mainnet' };
    svc.defaultOwnershipLaosChain = { mainnet: '100' };
    jest.resetAllMocks();
  });

  test('maps db rows into TransferQueryResult', async () => {
    tx.mockResolvedValueOnce([
      { from: 'a', to: 'b', timestamp: new Date(), blockNumber: 1, txHash: '0x', token_id: 7, contract_address: '0xc' },
    ]);
    const res = await resolver.transfers({ chainId: 'mainnet' } as any, { limit: 1 } as any, undefined as any);
    expect(res[0]).toMatchObject({ from: 'a', to: 'b', blockNumber: 1, tokenId: '7', contractAddress: '0xc' });
  });
});
