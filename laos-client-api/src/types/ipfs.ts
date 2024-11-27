import { AssetMetadata } from "./asset";
  
export interface IpfsUpload {
  id: number;
  ipfsHash: string;
  status: string;
  createdAt: Date;
  assetData: AssetMetadata;
}