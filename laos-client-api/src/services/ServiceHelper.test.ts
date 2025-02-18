import { ServiceHelper } from './ServiceHelper';
import { IPFSService } from './ipfs/IPFSService';
import { LaosService } from './blockchain/LaosService';
import { LaosConfig } from '../types';

jest.mock('./ipfs/IPFSService');
jest.mock('./blockchain/LaosService');

describe('ServiceHelper', () => {
  let mockConfig: LaosConfig;

  beforeEach(() => {
    mockConfig = {
      minterPvks: 'mockPvk',
      rpcMinter: 'mockRpc',
    };

    process.env.PINATA_API_KEY = 'mockPinataApiKey';
    process.env.PINATA_API_SECRET = 'mockPinataApiSecret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize ipfsService and laosService', () => {
      const serviceHelper = new ServiceHelper(mockConfig);

      expect(serviceHelper.ipfsService).toBeInstanceOf(IPFSService);
      expect(serviceHelper.laosService).toBeInstanceOf(LaosService);
    });

    it('should throw an error if Pinata API key or secret is missing', () => {
      delete process.env.PINATA_API_KEY;

      expect(() => new ServiceHelper(mockConfig)).toThrow('Pinata API key and secret are required');
    });
  });

  describe('parseAssetAttributes', () => {
    it('should parse valid JSON string into AssetAttributes array', () => {
      const jsonString = JSON.stringify([
        { trait_type: 'color', value: 'red' },
        { trait_type: 'size', value: 'large' },
      ]);

      const serviceHelper = new ServiceHelper(mockConfig);
      const result = serviceHelper.parseAssetAttributes(jsonString);

      expect(result).toEqual([
        { trait_type: 'color', value: 'red' },
        { trait_type: 'size', value: 'large' },
      ]);
    });

    it('should return an empty array if string is empty', () => {
      const jsonString = '';
      const serviceHelper = new ServiceHelper(mockConfig);
      const result = serviceHelper.parseAssetAttributes(jsonString);
      expect(result).toEqual([]);
    });


    it('should throw an error if JSON is not an array', () => {
      const jsonString = JSON.stringify({ trait_type: 'color', value: 'red' });
      const serviceHelper = new ServiceHelper(mockConfig);
      expect(() => serviceHelper.parseAssetAttributes(jsonString)).toThrow('JSON is not an array');
    });


    it('should throw an error if JSON structure is invalid', () => {
      const jsonString = JSON.stringify([{ trait_type: 'color', val: 'red' }]);

      const serviceHelper = new ServiceHelper(mockConfig);

      expect(() => serviceHelper.parseAssetAttributes(jsonString)).toThrow('Invalid JSON structure at index 0');
    });

    it('should throw an error if JSON string is invalid', () => {
      const jsonString = '[{ trait_type: color, value: red }]'; // Invalid JSON

      const serviceHelper = new ServiceHelper(mockConfig);

      expect(() => serviceHelper.parseAssetAttributes(jsonString)).toThrow('Failed to parse JSON string:');
    });
  });
});
