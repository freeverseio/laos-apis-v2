import { createHash } from 'crypto';
import { v5 as uuidv5 } from 'uuid';
import { generateAssetUUID, parseBaseURI } from './util';

beforeEach(() => {         
  const consoleSpy = jest.spyOn(console, 'log');       
  consoleSpy.mockImplementation(() => {});
  const consoleSpyWarn = jest.spyOn(console, 'warn');       
  consoleSpyWarn.mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('generateUUID', () => {
  it('should combine tokenId and contractAddress and generate a UUID', () => {
    const tokenId = 73650113464448320614314146005078575017174739311147380597791116992882814864680n;
    const contractAddress = '0xfec1af3e023432ef364ef88653094442cfc00020';
    expect(generateAssetUUID(tokenId, contractAddress, 1)).toBe('f63a3eac-6a89-5692-897e-c6a48ded2bf4');
    expect(generateAssetUUID(tokenId, contractAddress, 1)).toBe('f63a3eac-6a89-5692-897e-c6a48ded2bf4');


  });

  it('should combine tokenId and contractAddress and generate a UUID', () => {
    const tokenId = 860693765837880643717743864570872188823830693415160471676824633488737684776n;
    const contractAddress = '0xfec1af3e023432ef364ef88653094442cfc00020';
    expect(generateAssetUUID(tokenId, contractAddress, 1)).toBe('17437574-bffc-57c5-adb2-193f17399c2e');
    expect(generateAssetUUID(tokenId, contractAddress, 1)).toBe('17437574-bffc-57c5-adb2-193f17399c2e');

    
  });
});



describe('parseBaseURI', () => {
    beforeAll(() => {
        // Mock environment variables
        process.env.LAOS_GLOBAL_CONSENSUS = '0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f';
        process.env.LAOS_PARACHAIN = '4006';
        process.env.LAOS_PALLET_INSTANCE = '51';
    });

    it('should parse a valid baseUri and return the expected structure', () => {
        const baseUri = 'https://uloc.io/GlobalConsensus(0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f)/Parachain(4006)/PalletInstance(51)/AccountKey20(0xfFfFffffffFFFFFFFfFFFFfE000000000000007a)/';
        const result = parseBaseURI(baseUri);

        expect(result).toEqual({
            globalConsensus: 'GlobalConsensus(0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f)',
            parachain: 'Parachain(4006)',
            palletInstance: 'PalletInstance(51)',
            accountKey20: '0xfFfFffffffFFFFFFFfFFFFfE000000000000007a',
            generalKey: null,
            ulocPrefix: 'GlobalConsensus(0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f)/Parachain(4006)/PalletInstance(51)/',
        });
    });

    it('should return null for an invalid baseUri', () => {      
        const baseUri = 'https://uloc.io/InvalidData/Parachain(2)/PalletInstance(3)/AccountKey20(0x123abc)';
        const result = parseBaseURI(baseUri);

        expect(result).toBeNull();
    });
});
