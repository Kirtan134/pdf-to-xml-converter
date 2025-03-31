import { Pool } from 'pg';

let pool: Pool | null = null;

export const getPool = async () => {
  if (pool) return pool;
  
  try {
    // Parse the connection string
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined");
    }
    
    // Create a new pool
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for some SSL connections
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 10000, // How long to wait for a connection to become available
    });
    
    // Test the connection
    const client = await pool.connect();
    console.log("Supabase connection successful");
    client.release();
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool = null; // Reset the pool so it will be recreated next time
    });
    
    return pool;
  } catch (error) {
    console.error("Failed to initialize Supabase connection:", error);
    throw error;
  }
};

// Create a simple query function
export const query = async (text: string, params?: any[]) => {
  const pool = await getPool();
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
};

// Close all connections
export const end = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
}; 