import { Pool } from 'pg';

class Database {
  private static pool: Pool | null = null;

  private static getPool() {
    if (!this.pool) {
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined in the environment variables');
      }
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
    }
    return this.pool;
  }

  public static async query(text: string, params?: any[]) {
    const client = await this.getPool().connect();
    try {
      const res = await client.query(text, params);
      return res;
    } finally {
      client.release();
    }
  }
}

export default Database;
