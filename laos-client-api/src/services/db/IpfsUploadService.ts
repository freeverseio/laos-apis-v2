import Database from './Database';
import { IpfsUpload } from '../../types/ipfs';
import { AssetMetadata } from '../../types/asset';



class IpfsUploadService {

  public static async insertIpfsUpload({
    ipfsHash,
    status,
    assetData
  }: {
    ipfsHash: string;
    status: string;
    assetData: AssetMetadata;
  }): Promise<IpfsUpload> {
    const res = await Database.query(
      'INSERT INTO api_ipfs_upload ( ipfs_hash, status, asset_data) VALUES ($1, $2, $3) RETURNING *',
      [ ipfsHash, status, assetData]
    );

    if (!res.rows[0]) {
      throw new Error('Failed to insert IPFS upload');
    }

    return res.rows[0];
  }

  public static async updateIpfsUpload(ipfsHash: string, status: string): Promise<IpfsUpload> {
    const res = await Database.query('UPDATE api_ipfs_upload SET status = $1 WHERE ipfs_hash = $2 RETURNING *', [status, ipfsHash]);
    return res.rows[0];
  }

  public static async deleteIpfsUpload(ipfsHash: string): Promise<void> {
    await Database.query('DELETE FROM api_ipfs_upload WHERE ipfs_hash = $1', [ipfsHash]);
  }

  public static async getIpfsUploadsByStatus(status: string): Promise<IpfsUpload[]> {
    const res = await Database.query('SELECT id, ipfs_hash, status, created_at, asset_data FROM api_ipfs_upload WHERE status = $1', [status]);
    if (!res.rows.length) {
      console.log(`No IPFS uploads found with status: ${status}`);
      return [];
    }
    // Parse asset_data into AssetMetadata
    const uploads = res.rows.map(row => {
      const assetData = typeof row.asset_data === 'string' ? JSON.parse(row.asset_data) : row.asset_data;
      return {
          id: row.id,
          ipfsHash: row.ipfs_hash,
          status: row.status,
          createdAt: row.created_at,
          assetData: assetData as AssetMetadata
      };
    });

    return uploads;
  }
}

export default IpfsUploadService;
