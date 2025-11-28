import axios, { AxiosResponse } from 'axios';

interface CollectionItem {
  id: string;
  evmCollectionAddress: string;
  rebaseable: boolean;
}

interface CollectionsApiResponse {
  collections: CollectionItem[];
}

interface CollectionResponse {
  id: string;
  evmCollectionAddress: string;
  rebaseable: boolean;
}

export class BtcService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAllCollections(): Promise<CollectionItem[]> {
    try {
      const response: AxiosResponse<CollectionsApiResponse> = await axios.get(
        `${this.baseUrl}/collections`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 200 && Array.isArray(response.data?.collections)) {
        return response.data.collections;
      } else {
        console.error(`Error fetching collections. Status: ${response.status}`);
        return [];
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  }

  async getCollectionById(id: string): Promise<CollectionItem | null> {
    try {
      const response: AxiosResponse<CollectionResponse> = await axios.get(
        `${this.baseUrl}/collection/${id}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      
      if (response.status === 200 && response.data) {
        return {
          id: response.data.id,
          evmCollectionAddress: response.data.evmCollectionAddress,
          rebaseable: response.data.rebaseable,
        };

      } else {
        console.error(`Error fetching collection by id. Status: ${response.status}`);
        return null;
      }

    } catch (error) {
      console.error(`Error fetching collections with id [${id}], probably the id does not exist in the BTC indexer:`, error);
      return null;
    }    
  }

}
