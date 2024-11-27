import Database from './Database';
import { Client } from '../../types/client';

class ClientService {
  public static async getClientById(clientId: string): Promise<Client | null> {
    const res = await Database.query('SELECT * FROM api_client WHERE id = $1', [clientId]);
    return res.rows[0] || null;
  }

  public static async getClientByKey(key: string): Promise<Client> {
    const res = await Database.query('SELECT * FROM api_client WHERE key = $1', [key]);

    if (!res.rows[0]) {
      throw new Error('Invalid API key');
    }

    if (!res.rows[0].active) {
      throw new Error('Client deactivated');
    }

    return res.rows[0];
  }

  // Insert a new client into the api_client table
  public static async insertClient(name: string, key: string, active: boolean = true): Promise<Client> {
    const insertQuery = `
      INSERT INTO api_client (name, key, active)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    try {
      const res = await Database.query(insertQuery, [name, key, active]);
      return res.rows[0];
    } catch (error) {
      console.error('Error inserting client:', error);
      throw new Error('Failed to insert client');
    }
  }

  public static async updateClientLock(id: string, lock: Date | null): Promise<Client> {
    let res;
    if (lock) {
      res = await Database.query('UPDATE api_client SET lock = $1 WHERE id = $2 RETURNING *', [lock, id]);      
    }else{
      res = await Database.query('UPDATE api_client SET lock = NULL WHERE id = $1 RETURNING *', [id]);
    }
    return res.rows[0];
  }

}

export default ClientService;
