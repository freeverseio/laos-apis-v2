import Database from './Database';
import { Contract, DbResult } from '../../types/contract';

class ContractService {
  private static transformDbResultToContract(dbResult: DbResult): Contract {
    return {
      id: dbResult.id.toString(),
      clientId: dbResult.client_id.toString(),
      chainId: dbResult.chain_id,
      contractAddress: dbResult.contract_address,
      laosContract: dbResult.laos_contract,
      batchMinterContract: dbResult.batch_minter_contract,
    };
  }

  public static async getClientContract(clientId: string, chainId: string, contract: string): Promise<Contract> {
    const res = await Database.query(
      'SELECT * FROM api_contract WHERE client_id = $1 AND chain_id = $2 AND contract_address = $3',
      [clientId, chainId, contract]
    );
    if (!res.rows[0]) {
      throw new Error('Contract not found');
    }
    return this.transformDbResultToContract(res.rows[0]);
  }

  public static async getClientContractByChain(clientId: string, chainId: string): Promise<Contract | null> {
    const res = await Database.query('SELECT * FROM api_contract WHERE client_id = $1 AND chain_id = $2', [clientId, chainId]);
    if (!res.rows[0]) {
      return null; 
    }
    return this.transformDbResultToContract(res.rows[0]);
  }

  public static async getClientContracts(clientId: string): Promise<Contract[]> {
    const res = await Database.query('SELECT * FROM api_contract WHERE client_id = $1', [clientId]);
    return res.rows.map(this.transformDbResultToContract);
  }

  public static async getContract(chainId: string, contract: string): Promise<Contract | null> {
    const res = await Database.query('SELECT * FROM api_contract WHERE chain_id = $1 AND contract_address = $2', [chainId, contract]);
    if (!res.rows[0]) {
      return null;
    }
    return this.transformDbResultToContract(res.rows[0]);
  }

  // Insert a new contract into the api_contract table
  public static async insertContract(
    clientId: string,
    chainId: string,
    contractAddress: string,
    laosContract: string,
    batchMinterContract?: string
  ): Promise<Contract> {
    const insertQuery = `
      INSERT INTO api_contract (client_id, chain_id, contract_address, laos_contract, batch_minter_contract)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    try {
      const res = await Database.query(insertQuery, [
        clientId,
        chainId,
        contractAddress,
        laosContract,
        batchMinterContract || null, // Allow batch_minter_contract to be optional
      ]);
      return this.transformDbResultToContract(res.rows[0]);
    } catch (error) {
      console.error('Error inserting contract:', error);
      throw new Error('Failed to insert contract');
    }
  }
  
}

export default ContractService;
