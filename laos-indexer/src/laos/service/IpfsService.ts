import axios from 'axios';
import { Attribute, TokenUriFetchState, BaseTokenUri } from '../../model';
import { getGenericTokenUriModel } from '../factory';

export class IpfsService {
  private ipfsUrlToHttpUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', process.env.PRIVATE_IPFS_GATEWAY || 'ipfs://');
    }
    return url;
  }

  private async fetchData(url: string): Promise<any> {
    try {
      const gatewayKey = process.env.PRIVATE_IPFS_GATEWAY_API_KEY;
  
      const headers: Record<string, string> = {};
      if (gatewayKey) {
        headers['x-pinata-gateway-token'] = gatewayKey;
      }
      headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  
      const response = await axios.get(url, { headers });
  
      return response.data;
    } catch (error) {
      console.warn('WARNING: Error fetching data from URL:', url, error);
      return null;
    }
  }

  private async getDataFromIpfs(ipfsUrl: string): Promise<any> {
    const httpUrl = this.ipfsUrlToHttpUrl(ipfsUrl);
    let data;
    let fallback = false;
    try {
      data = await this.fetchData(httpUrl);  

    } catch (error) {      
      // fallback to different ipfs gateway
      fallback = true;      
    }

    if (data === null || fallback) {
      if (ipfsUrl.startsWith('ipfs://')) {
        const httpUrlFallback = ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
        console.log('Falling back to ipfs.io:', httpUrlFallback);
        data = await this.fetchData(httpUrlFallback);
        console.log('Fetched data from ipfs.io done');
        return data;
      }else{
        return null;
      }
    }

    return data;
  }

  private async getDataFromHttp(httpUrl: string): Promise<any> {
    return await this.fetchData(httpUrl);
  }

  private mapAttributes(attributes: any[]): Attribute[] | null {
    if (attributes && Array.isArray(attributes)) {
      attributes = attributes.map((attr: any) => {
        if (attr.trait_type && attr.value) {
          const attribute = new Attribute(undefined, { traitType: attr.trait_type, value: attr.value });
          return attribute;
        } else {
          console.warn('Invalid attribute format:', attr);
          return null;
        }
      }).filter(attr => attr !== null);
    }
    return attributes;
  }

  public async getTokenURIData(url: string): Promise<Partial<BaseTokenUri>> {
    let data: any;
    if (url.startsWith('ipfs://')) {
      data = await this.getDataFromIpfs(url);
    } else {
      data = await this.getDataFromHttp(url);
    }

    if (!data) {
      throw new Error('Failed to fetch token URI data');
    }
    let attributes;
    if(data.attributes){
      try{
        attributes = this.mapAttributes(data.attributes);
      } catch(error){
        console.warn('Error mapping attributes:', error);
      }
    }

    const TokenUri = getGenericTokenUriModel<BaseTokenUri>(process.env.TOKEN_URI_MODEL!);
    const tokenUri = new TokenUri({
      id: url,
      state:  TokenUriFetchState.Done,
      name: data.name || null,
      description: data.description || null,
      image: data.image || null,
      attributes,
      fetched: new Date(),
    });

    return tokenUri;
  }
}