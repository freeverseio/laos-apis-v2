import PinataSDK from '@pinata/sdk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { IPFSService } from './IPFSService';
import { AssetMetadata } from '../../types/asset';

// Mocking the Pinata SDK methods
jest.mock('@pinata/sdk');

describe('IPFSService', () => {
  let service: IPFSService;
  let mockAxios: MockAdapter;
  const pinataApiKey = 'testPinataApiKey';
  const pinataApiSecret = 'testPinataApiSecret';
  const assetJson: AssetMetadata = { name: 'Test Asset', description: 'Test Description', image: 'testImage', attributes: [] };

  const mockTestAuthentication = jest.fn();
  const mockPinJSONToIPFS = jest.fn();
  const mockPinFileToIPFS = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Setting up the PinataSDK mock implementation
    (PinataSDK as any).mockImplementation(() => ({
      testAuthentication: mockTestAuthentication,
      pinJSONToIPFS: mockPinJSONToIPFS,
      pinFileToIPFS: mockPinFileToIPFS,
    }));
  });

  beforeEach(() => {
    service = new IPFSService(pinataApiKey, pinataApiSecret);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  describe('uploadAssetMetadataToIPFS', () => {
    it('should upload asset metadata successfully', async () => {
      mockTestAuthentication.mockResolvedValueOnce({});
      mockPinJSONToIPFS.mockResolvedValueOnce({ IpfsHash: 'testHash' });

      const result = await service.uploadAssetMetadataToIPFS(assetJson, 'Test Name');
      expect(result).toBe('testHash');
      expect(mockTestAuthentication).toHaveBeenCalled();
      expect(mockPinJSONToIPFS).toHaveBeenCalledWith(assetJson, {
        pinataMetadata: {
          name: 'Test Name',
        },
      });
    });

    it('should throw an error if upload fails', async () => {
      mockTestAuthentication.mockResolvedValue({});
      mockPinJSONToIPFS.mockRejectedValue(new Error('Upload Failed'));

      await expect(service.uploadAssetMetadataToIPFS(assetJson, 'Test Name')).rejects.toThrow('Upload Failed');
    });
  });

  describe('uploadImageToIPFS', () => {
    const validBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABFUlEQVR42mNgoBAwUqifm5lb/QMTAwMDAz/1xsbG+UAFm8jAxUgdxCCPzh+ITV8Pl93IAD/dIgaGCELwPxMDAwMDP8YGBh/7RGG/kEgKSAEL8nIQvAUEfIgEZYKj+Io7CP4mJgj6KixCPwmJgk5BChkgAN9BiJDAAEaJHDgmJgElQjCUwANUQC1RBcFYFUC5n8D8GhsZ/9UEk/NdgbQsQnoDAzP/5BIxVh0gEKyNiDAWfAiD9+/eJDh/nIISBAohLCFYSZAeIDKQo8IUwNgHMAkIZsAB9uHRASZAkWOTQAUVNDAyM/8bGxr/gVCh9/RhgEkHNBMQ2xAgSMQUtACPYRYH/AkgIa4mO/MDAwMDP8AANXQqoimzGDtAAAAAElFTkSuQmCC';

    it('should upload image successfully', async () => {
      mockTestAuthentication.mockResolvedValueOnce({});
      mockAxios.onPost('https://api.pinata.cloud/pinning/pinFileToIPFS').reply(200, { IpfsHash: 'testHash' });

      const result = await service.uploadImageToIPFS(validBase64Image);
      expect(result).toBe('testHash');
    });

    it('should throw an error for invalid base64 string', async () => {
      const invalidBase64Image = 'invalidbase64string';
      await expect(service.uploadImageToIPFS(invalidBase64Image)).rejects.toThrow('Invalid base64 string');
    });

    it('should throw an error if image upload fails', async () => {
      mockTestAuthentication.mockResolvedValue({});
      mockAxios.onPost('https://api.pinata.cloud/pinning/pinFileToIPFS').reply(500);

      await expect(service.uploadImageToIPFS(validBase64Image)).rejects.toThrow();
    });
  });


  describe('getCid', () => {
    it('should return the CID of the asset metadata', async () => {
      const result = await service.getCid(assetJson);
      expect(result).toBe('QmRjcEzmghGAoCG5y1kfhjpHCEbvsSgDUEtidS2MXS4AzF');
    });

    it('should return the CID of the asset metadata', async () => {
      const assetJsonTest: AssetMetadata = { name: 'Example Token ', description: 'This is an example token', image: 'https://ipfs.io/ipfs/QmS326uhnQp5PsnznQvHhkzqKLfB7ieWz3onmFXsRvERig', attributes: [ { trait_type: 'health', value: '11' } ] };
      const result = await service.getCid(assetJsonTest);
      expect(result).toBe('QmQBqscaTTKKh3br2tqyWjwBFbfsQpFjKDqrjY64jR57jG');
    });
  });
});
