import axios from 'axios';
import { BtcService } from '../../src/services/btc/BtcService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BtcService', () => {
  const baseUrl = 'http://btc-indexer';
  let service: BtcService;
  const originalError = console.error;
  beforeEach(() => {
    service = new BtcService(baseUrl);
    jest.resetAllMocks();
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  test('getAllCollections returns collections on 200', async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: { collections: [{ id: '1', evmCollectionAddress: '0xabc', rebaseable: true }] } } as any);
    const res = await service.getAllCollections();
    expect(res).toEqual([{ id: '1', evmCollectionAddress: '0xabc', rebaseable: true }]);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/collections`, { headers: { Accept: 'application/json' } });
  });

  test('getAllCollections returns [] on non-200 and logs error', async () => {
    mockedAxios.get.mockResolvedValue({ status: 500, data: {} } as any);
    const res = await service.getAllCollections();
    expect(res).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  test('getAllCollections returns [] on error and logs error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network'));
    const res = await service.getAllCollections();
    expect(res).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  test('getCollectionById returns item on 200', async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: { id: '1', evmCollectionAddress: '0xabc', rebaseable: false } } as any);
    const res = await service.getCollectionById('1');
    expect(res).toEqual({ id: '1', evmCollectionAddress: '0xabc', rebaseable: false });
    expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/collections/1`, { headers: { Accept: 'application/json' } });
  });

  test('getCollectionById returns null on non-200 and logs error', async () => {
    mockedAxios.get.mockResolvedValue({ status: 404, data: {} } as any);
    const res = await service.getCollectionById('nope');
    expect(res).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  test('getCollectionById returns null on error and logs error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network'));
    const res = await service.getCollectionById('1');
    expect(res).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });
});
