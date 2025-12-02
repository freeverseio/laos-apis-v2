import { QueryBuilderService } from '../../src/services/QueryBuilderService';

// We will stub internal maps via casting since they are private
function makeService(overrides: Partial<Record<string, any>> = {}) {
  const svc = new QueryBuilderService() as any;
  svc.supportedChains = overrides.supportedChains || { mainnet: 'mainnet' };
  svc.supportedLaosChains = overrides.supportedLaosChains || { '100': 'mainnet' };
  svc.defaultOwnershipLaosChain = overrides.defaultOwnershipLaosChain || { mainnet: '100' };
  return svc as QueryBuilderService;
}

describe('QueryBuilderService', () => {
  test('buildTokenQuery builds with cursor and params', async () => {
    const svc = makeService();
    const after = Buffer.from(`${Date.UTC(2024,0,1)}:5:0xffff`).toString('base64');
    const where: any = { owner: '0xOwner', laosContract: '0xLaos', tokenId: '10' };
    const pagination: any = { first: 2, after };
    const res = await (svc as any).buildTokenQuery(where, pagination, 'created_at ASC', '0xCOL');
    expect(res.parameters.length).toBeGreaterThan(0);
    expect(res.query).toContain('WITH ranked AS');
    expect(res.query).toContain('ORDER BY created_at ASC, la.log_index ASC');
  });

  test('buildTokenQueryCount builds base count query', async () => {
    const svc = makeService();
    const where: any = { owner: '0xOwner' };
    const res = await (svc as any).buildTokenQueryCount(where, '0xcol');
    expect(res.query).toContain('SELECT COUNT(*) as count');
  });

  test('buildTokenByIdQuery normalizes and sets params', async () => {
    const svc = makeService();
    const res = await (svc as any).buildTokenByIdQuery('0xABC', '7', 'mainnet', '100');
    expect(res.parameters).toEqual(['0xabc', '7']);
    expect(res.query).toContain('WITH contract_data AS');
  });

  test('buildTransferQuery builds with defaults and pagination', async () => {
    const svc = makeService();
    const where: any = { chainId: 'mainnet', laosChainId: '100', tokenId: '9', to_startsWith: '0x' };
    const pagination: any = { limit: 10, offset: 5 };
    const { query, parameters } = await (svc as any).buildTransferQuery(where, pagination);
    expect(query).toContain('ORDER BY t.timestamp DESC');
    expect(parameters).toEqual(['100', '9', '0x%', 10, 5]);
  });

  test('buildTokenHistoryQuery builds with ordering and limit', async () => {
    const svc = makeService();
    const pagination: any = { orderBy: 'timestamp ASC', limit: 5, offset: 2 };
    const { query, parameters } = await (svc as any).buildTokenHistoryQuery('0xaddr', '1', 'mainnet', '100', pagination);
    expect(query).toContain('ORDER BY timestamp ASC');
    expect(parameters).toEqual(['1', '0xaddr', 5, 2]);
  });
});
