import axios, { AxiosResponse } from 'axios';

interface CollectionItem {
  collectionId: string;
  laosContractAddress: string;
}


interface TokenOwner {
  owner: string;
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

interface TokenOwnerResponse {  
  owner: string;
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

  async getCollectionById(id: string): Promise<CollectionItem | null> {
    try {
      const response: AxiosResponse<CollectionResponse> = await axios.get(
        `${this.baseUrl}/brc721/collection/${id}`,
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
      console.error(`Error fetching collections with id [${id}], probably the id does not exist in the BTC indexer:`, error);
      return null;
    }    
  }

  async getTokenCurrenOwner(collectionId: string, tokenId: string): Promise<TokenOwner | null> {
    try {
      const response: AxiosResponse<TokenOwnerResponse> = await axios.get(
        `${this.baseUrl}/brc721/token/${collectionId}/${tokenId}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      if (response.status === 200) {
        console.log(`Token ${tokenId} from collection ${collectionId} is owned by: ${response.data}`);
        /* ??
          pub enum Brc721TokenOwnership {
            InitialOwner(H160),
            NftId(Brc721Output),
          }
        */
        return {
          owner: response.data?.owner,
        };

      } else {
        console.error(`Error fetching getTokenCurrenOwner. Status: ${response.status}`);
        return null;
      }

    } catch (error) {
      console.error(`Error fetching token owner with collectionId [${collectionId}] and tokenId [${tokenId}], probably the ids do not exist in the BTC indexer:`, error);
      return null;
    }    
  }

}