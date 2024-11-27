import { IPFSService } from "./ipfs/IPFSService";
import { LaosService } from "./blockchain/LaosService";
import { LaosConfig, AssetAttributes } from "../types";

export class ServiceHelper {
  public ipfsService: IPFSService;
  public laosService: LaosService;

  constructor(config: LaosConfig) {
    const pinataApiKey = process.env.PINATA_API_KEY || '';
    const pinataApiSecret = process.env.PINATA_API_SECRET || '';

    if (!pinataApiKey || !pinataApiSecret) {
      throw new Error('Pinata API key and secret are required');
    }

    this.ipfsService = new IPFSService(pinataApiKey, pinataApiSecret);
    this.laosService = new LaosService(config, this.ipfsService);
  }

  public parseAssetAttributes(jsonString: string): AssetAttributes[] {
    // if empty string, return empty array
    if (jsonString === '') {
      return [];
    }

    try {
      const parsedArray = JSON.parse(jsonString);
      if (!Array.isArray(parsedArray)) {
        throw new Error('JSON is not an array');
      }

      parsedArray.forEach((item, index) => {
        if (
          typeof item.trait_type !== 'string' ||
          typeof item.value !== 'string'
        ) {
          throw new Error(`Invalid JSON structure at index ${index}`);
        }
      });

      return parsedArray as AssetAttributes[];
    } catch (error) {
      throw new Error(`Failed to parse JSON string: ${error}`);
    }
  }

  public async handleImageUpload(image: string): Promise<string> {
    if (image.startsWith("data:image/")) {
      // Upload to IPFS
      const ipfsHash = await this.ipfsService.uploadImageToIPFS(image);
      return `ipfs://${ipfsHash}`;
    }
    return image;
  }


  private generateEvochainBaseUri(ulocPrefix: string, contractAddress: string) {
    return `https://uloc.io/${ulocPrefix}AccountKey20(${contractAddress})/`;
  }
  
  private getEvochainUlocPrefix(evochainTarget: string) {
    let ulocPrefix = '';
    const ulocPrefixLaosSigma = 'GlobalConsensus(0:0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f)/Parachain(4006)/PalletInstance(51)/'
    const ulocPrefixLaos = 'GlobalConsensus(2)/Parachain(3370)/PalletInstance(51)/'
    if (evochainTarget === 'LAOS') {
      ulocPrefix = ulocPrefixLaos;
    } else if (evochainTarget === 'LAOS_SIGMA') {
      ulocPrefix = ulocPrefixLaosSigma;
    } else {
      console.error('No ulocPrefix found!!!');
      return null;
    }
    return ulocPrefix;
  }

  private isHexadecimal(str: string) {
    const hexRegex = /^0x[0-9A-Fa-f]+$/g;
    return hexRegex.test(str);
  }
   
  public generateBaseUri(contractAddress: string, evochainTarget: string) {
    if (!contractAddress || !this.isHexadecimal(contractAddress)) {
      return null;
    }
  
    const ulocPrefix = this.getEvochainUlocPrefix(evochainTarget);
    if (!ulocPrefix) return null;
  
    const baseUri = this.generateEvochainBaseUri(ulocPrefix, contractAddress);
    return baseUri;
  } 
  
}
