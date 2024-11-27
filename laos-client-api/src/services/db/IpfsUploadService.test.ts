import Database from './Database';
import IpfsUploadService from './IpfsUploadService';
import { AssetMetadata } from '../../types/asset';
import { IpfsUpload } from '../../types/ipfs';

// Mocking the Database query method
jest.mock('./Database', () => ({
  query: jest.fn(),
}));

describe('IpfsUploadService', () => {
  const ipfsHash = 'Qm...'; // Example IPFS hash
  const status = 'uploaded';
  const assetData: AssetMetadata = { name: 'Asset', description: 'Test asset', image: 'https://example.com/image.png', attributes: [] };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  describe('insertIpfsUpload', () => {
    it('should insert an IPFS upload and return the inserted data', async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            ipfs_hash: ipfsHash,
            status,
            asset_data: assetData,
          },
        ],
      };
      (Database.query as jest.Mock).mockResolvedValue(mockResponse);

      const result = await IpfsUploadService.insertIpfsUpload({
        ipfsHash,
        status,
        assetData,
      });

      expect(Database.query).toHaveBeenCalledWith(
        'INSERT INTO api_ipfs_upload ( ipfs_hash, status, asset_data) VALUES ($1, $2, $3) RETURNING *',
        [ipfsHash, status, assetData]
      );
      expect(result).toEqual(mockResponse.rows[0]);
    });

    it('should throw an error when insert fails', async () => {
      const mockResponse = { rows: [] };
      (Database.query as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        IpfsUploadService.insertIpfsUpload({
          ipfsHash,
          status,
          assetData,
        })
      ).rejects.toThrow('Failed to insert IPFS upload');
    });
  });

  describe('updateIpfsUpload', () => {
    it('should update the status of an IPFS upload', async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            ipfs_hash: ipfsHash,
            status,
          },
        ],
      };
      (Database.query as jest.Mock).mockResolvedValue(mockResponse);

      const result = await IpfsUploadService.updateIpfsUpload(ipfsHash, status);

      expect(Database.query).toHaveBeenCalledWith(
        'UPDATE api_ipfs_upload SET status = $1 WHERE ipfs_hash = $2 RETURNING *',
        [status, ipfsHash]
      );
      expect(result).toEqual(mockResponse.rows[0]);
    });
  });

  describe('deleteIpfsUpload', () => {
    it('should delete an IPFS upload by hash', async () => {
      (Database.query as jest.Mock).mockResolvedValue({});

      await IpfsUploadService.deleteIpfsUpload(ipfsHash);

      expect(Database.query).toHaveBeenCalledWith(
        'DELETE FROM api_ipfs_upload WHERE ipfs_hash = $1',
        [ipfsHash]
      );
    });
  });

  describe('getIpfsUploadsByStatus', () => {
    it('should retrieve IPFS uploads by status', async () => {
      const mockResponse = {
        rows: [
          {
            id: 1,
            ipfs_hash: ipfsHash,
            status,
            created_at: new Date(),
            asset_data: JSON.stringify(assetData),
          },
        ],
      };
      (Database.query as jest.Mock).mockResolvedValue(mockResponse);

      const result = await IpfsUploadService.getIpfsUploadsByStatus(status);

      expect(Database.query).toHaveBeenCalledWith(
        'SELECT id, ipfs_hash, status, created_at, asset_data FROM api_ipfs_upload WHERE status = $1',
        [status]
      );

      expect(result).toEqual([
        {
          id: 1,
          ipfsHash,
          status,
          createdAt: mockResponse.rows[0].created_at,
          assetData,
        },
      ]);
    });

    it('should return an empty array if no uploads found', async () => {
      const mockResponse = { rows: [] };
      (Database.query as jest.Mock).mockResolvedValue(mockResponse);

      const result = await IpfsUploadService.getIpfsUploadsByStatus(status);

      expect(Database.query).toHaveBeenCalledWith(
        'SELECT id, ipfs_hash, status, created_at, asset_data FROM api_ipfs_upload WHERE status = $1',
        [status]
      );
      expect(result).toEqual([]);
    });
  });
});
