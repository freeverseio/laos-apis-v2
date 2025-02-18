import axios, { AxiosInstance } from 'axios';

interface OwnershipContractsResponse {
  data: {
    ownershipContracts: {
      laosChainId: string;
    }[];
  };
}

class IndexerService {
  private api: AxiosInstance;
  private graphqlEndpoint: string;

  constructor(graphqlEndpoint: string) {
    this.graphqlEndpoint = graphqlEndpoint;
    this.api = axios.create({
      baseURL: graphqlEndpoint,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async getOwnershipContracts(chainId: string, contractAddress: string): Promise<string | null> {
    const query = `
      query MyQuery {
        ownershipContracts(where: {chainId: "${chainId}", contractAddress: "${contractAddress}"}) {
          laosChainId
        }
      }
    `;
  
    try {
      const response = await this.api.post<OwnershipContractsResponse>('', {
        query,
      });
  
      // Return the first element or null if the array is empty
      return response.data.data.ownershipContracts[0]?.laosChainId || null;
    } catch (error) {
      console.error('Error fetching ownership contracts:', error);
      throw new Error('Failed to fetch ownership contracts');
    }
  }
  
  
}

export default IndexerService;
