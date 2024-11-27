import { Pool } from 'pg';
import Database from './Database';

// Mock the Pool and Client classes from 'pg'
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn(() => mClient),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Database', () => {
  let pool: any;
  let client: any;

  beforeEach(() => {
    pool = new Pool(); // Instance of the mocked Pool
    client = pool.connect(); // Instance of the mocked Client
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  it('should initialize Pool if not already initialized', async () => {
    process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/testdb';

    await Database.query('SELECT * FROM users', []);

    // Check if Pool was created
    expect(Pool).toHaveBeenCalledWith({
      connectionString: process.env.DATABASE_URL,
    });
  });

  it('should throw error if DATABASE_URL is not defined', async () => {
    delete process.env.DATABASE_URL; // Ensure DATABASE_URL is undefined
  
    // Use a try-catch block to catch the synchronous error
    try {
      await Database.query('SELECT * FROM users', []);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

    }
  });

  it('should execute query and return result', async () => {
    process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/testdb';

    const mockResult = { rows: [{ id: 1, name: 'John Doe' }] };
    client.query.mockResolvedValueOnce(mockResult);

    const result = await Database.query('SELECT * FROM users WHERE id = $1', [1]);

    expect(client.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
    expect(result).toEqual(mockResult);
  });

  it('should release client after query', async () => {
    process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/testdb';

    const mockResult = { rows: [{ id: 1, name: 'John Doe' }] };
    client.query.mockResolvedValueOnce(mockResult);

    await Database.query('SELECT * FROM users WHERE id = $1', [1]);

    expect(client.release).toHaveBeenCalled();
  });

  it('should throw error if query execution fails', async () => {
    process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/testdb';

    const mockError = new Error('Query failed');
    client.query.mockRejectedValueOnce(mockError);

    await expect(Database.query('SELECT * FROM users WHERE id = $1', [1]))
      .rejects
      .toThrow('Query failed');
    
    expect(client.release).toHaveBeenCalled(); // Ensure the client is released even after failure
  });
});
