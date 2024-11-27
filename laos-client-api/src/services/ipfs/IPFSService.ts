import PinataSDK from '@pinata/sdk';
import axios from 'axios';
import FormData from 'form-data';
import { AssetMetadata } from '../../types/asset';
import { CID } from 'multiformats/cid'
import IpfsUploadService from '../db/IpfsUploadService';
import * as Hash from 'typestub-ipfs-only-hash'

export class IPFSService {
  private pinata: PinataSDK;
  private pinataApiKey: string;
  private pinataApiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API key and secret are required');
    }
    this.pinataApiKey = apiKey;
    this.pinataApiSecret = apiSecret;
    this.pinata = new PinataSDK(apiKey, apiSecret);
  }

  private async retry<T>(operation: () => Promise<T>, retries: number, delay: number): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt < retries) {
          console.warn(`Operation failed, retrying... (${attempt + 1}/${retries})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          console.error('Operation failed after maximum retries:', error);
          throw error;
        }
      }
    }
    throw new Error('Unexpected error in retry logic');
  }

  public async uploadAssetMetadataToIPFS(assetJson: AssetMetadata, name: string | null, cid?: string): Promise<string> {
    try {
      if (cid) {
        await IpfsUploadService.insertIpfsUpload({ ipfsHash: cid, status: 'pending', assetData: assetJson });
      }
      await this.pinata.testAuthentication();
      const { IpfsHash } = await this.pinAssetMetadata(assetJson, name);
      if (cid) {
         await IpfsUploadService.deleteIpfsUpload(IpfsHash);
      }
      return IpfsHash;
    } catch (error: any) {
      console.error('Upload Failed:', error.message);
      if (cid) {
        await IpfsUploadService.updateIpfsUpload(cid, 'failed');
      }
      throw error;
    }
  }

  public async retryFailedIpfsUploads(): Promise<void> {
    const failedUploads = await IpfsUploadService.getIpfsUploadsByStatus('failed');
    const uploadPromises = failedUploads.map(async (upload) => {
      try {
        await IpfsUploadService.updateIpfsUpload(upload.ipfsHash, 'pending');
        await this.uploadAssetMetadataToIPFS(upload.assetData, upload.assetData.name, upload.ipfsHash);
        await IpfsUploadService.deleteIpfsUpload(upload.ipfsHash);
      } catch (error) {
        console.error(`Failed to upload asset ${upload.ipfsHash}:`, error);
        await IpfsUploadService.updateIpfsUpload(upload.ipfsHash, 'failed');
      }
    });
    await Promise.all(uploadPromises); // Launch all in parallel
  }

  private async pinAssetMetadata(assetJson: AssetMetadata, name: string | null): Promise<{ IpfsHash: string }> {
    const operation = () => this.pinata.pinJSONToIPFS(assetJson, {
      pinataMetadata: {
        name: name || 'Untitled',
      },
    });
    return this.retry(operation, 2, 1000); // 2 retries with 1 second delay
  }

  public async getCid(assetJson: AssetMetadata): Promise<string> {
    const json = JSON.stringify(assetJson);
    return Hash.of(Buffer.from(json));;
  }


  public async uploadImageToIPFS(base64Image: string): Promise<string> {
    try {
      await this.pinata.testAuthentication();

      // Extract MIME type and extension from base64 string
      const matches = base64Image.match(/^data:(image\/[a-zA-Z]+);base64,/);
      if (!matches || matches.length !== 2) {
        throw new Error('Invalid base64 string');
      }
      const mimeType = matches[1];
      const extension = mimeType.split('/')[1];

      // Remove the base64 prefix from the string
      const buffer = Buffer.from(base64Image.split(',')[1], 'base64');

      // Create form data
      const form = new FormData();
      form.append('file', buffer, {
        filename: `image.${extension}`,
        contentType: mimeType,
      });

      // Upload image to IPFS
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      const response = await axios.post(url, form, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataApiSecret,
        },
      });

      return response.data.IpfsHash;
    } catch (error: any) {
      console.error('Image Upload Failed:', error.message);
      throw error;
    }
  }
}
