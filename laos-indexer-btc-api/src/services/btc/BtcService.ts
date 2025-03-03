import axios, { AxiosResponse } from 'axios';

interface CollectionItem {
  collectionId: string;
  laosContractAddress: string;
}

interface CollectionsResponse {
  entries: string[][];
  more: boolean;
  prev: string | null;
  next: string | null;
}

// RUST response
interface CollectionResponse {
  id: string;
  LAOS_address: string;
  rebaseable: boolean;
}

export class BtcService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAllCollections(): Promise<CollectionsResponse> {
    try {
      const response: AxiosResponse<CollectionsResponse> = await axios.get(
        `${this.baseUrl}/brc721/collections`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error fetching collections. Status: ${response.status}`);
        return { entries: [], more: false, prev: null, next: null }; // Return a default response on error
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      return { entries: [], more: false, prev: null, next: null }; // Return a default response on error
    }
  }

  // TODO use new btc indexer method
  async getCollectionById(id: string): Promise<CollectionItem | null> {
    // const collectionsResponse = await this.getAllCollections();
    // console.log('collectionsResponse:', collectionsResponse);

    // if (collectionsResponse && collectionsResponse.entries) {
    //   for (const entry of collectionsResponse.entries) {
    //     if (entry[0] === id) {
    //       return { collectionId: entry[0], laosContractAddress: entry[1] };
    //     }
    //   }
    // }

    try {
      const response: AxiosResponse<CollectionResponse> = await axios.get(
        `${this.baseUrl}/brc721/collections/${id}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 200) {
        return {
          collectionId: response.data?.id,
          laosContractAddress: response.data?.LAOS_address,
        };

      } else {
        console.error(`Error fetching collection by id. Status: ${response.status}`);
        return null;
      }

    } catch (error) {
      console.error('Error fetching collections:', error);
      return null;
    }    
  }

}