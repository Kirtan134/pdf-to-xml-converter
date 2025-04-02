import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Simple wrapper for Prisma-like interface
export const prisma = {
  // Conversion model operations
  conversion: {
    findMany: async ({ where = {}, orderBy = {}, select = {}, take, skip } = {}) => {
      try {
        // Build the query parts
        let query = 'SELECT ';
        const params: any[] = [];
        let paramIndex = 1;
        
        // Build the SELECT clause
        const selectFields = Object.keys(select).length > 0 
          ? Object.keys(select)
              .filter(key => select[key])
              .map(key => `"${key}"`) // Add double quotes for case sensitivity
              .join(', ')
          : '*';
        
        query += selectFields;
        query += ' FROM "conversion"';
        
        // Build the WHERE clause
        if (Object.keys(where).length > 0) {
          query += ' WHERE ';
          const whereClauses = [];
          
          for (const [key, value] of Object.entries(where)) {
            if (value !== undefined) {
              whereClauses.push(`"${key}" = $${paramIndex++}`);
              params.push(value);
            }
          }
          
          query += whereClauses.join(' AND ');
        }
        
        // Build the ORDER BY clause
        if (Object.keys(orderBy).length > 0) {
          query += ' ORDER BY ';
          const orderClauses = [];
          
          for (const [key, value] of Object.entries(orderBy)) {
            // Use double quotes to preserve column case
            orderClauses.push(`"${key}" ${value === 'desc' ? 'DESC' : 'ASC'}`);
          }
          
          query += orderClauses.join(', ');
        }
        
        // Add LIMIT and OFFSET
        if (take !== undefined) {
          query += ` LIMIT $${paramIndex++}`;
          params.push(take);
        }
        
        if (skip !== undefined) {
          query += ` OFFSET $${paramIndex++}`;
          params.push(skip);
        }
        
        // Execute the query
        const result = await pool.query(query, params);
        return result.rows;
      } catch (error) {
        console.error('Error in findMany:', error);
        throw error;
      }
    },
    
    findUnique: async ({ where }) => {
      try {
        if (!where || Object.keys(where).length === 0) {
          throw new Error('Where clause is required for findUnique');
        }
        
        // Build the query
        let query = 'SELECT * FROM "conversion" WHERE ';
        const params: any[] = [];
        let paramIndex = 1;
        const whereClauses = [];
        
        for (const [key, value] of Object.entries(where)) {
          whereClauses.push(`"${key}" = $${paramIndex++}`);
          params.push(value);
        }
        
        query += whereClauses.join(' AND ');
        query += ' LIMIT 1';
        
        // Execute the query
        const result = await pool.query(query, params);
        return result.rows[0] || null;
      } catch (error) {
        console.error('Error in findUnique:', error);
        throw error;
      }
    },
    
    findFirst: async ({ where = {}, orderBy = {}, select = {} } = {}) => {
      try {
        // Build the query parts
        let query = 'SELECT ';
        const params: any[] = [];
        let paramIndex = 1;
        
        // Build the SELECT clause
        const selectFields = Object.keys(select).length > 0 
          ? Object.keys(select)
              .filter(key => select[key])
              .map(key => `"${key}"`) // Add double quotes for case sensitivity
              .join(', ')
          : '*';
        
        query += selectFields;
        query += ' FROM "conversion"';
        
        // Build the WHERE clause
        if (Object.keys(where).length > 0) {
          query += ' WHERE ';
          const whereClauses = [];
          
          for (const [key, value] of Object.entries(where)) {
            if (value !== undefined) {
              whereClauses.push(`"${key}" = $${paramIndex++}`);
              params.push(value);
            }
          }
          
          query += whereClauses.join(' AND ');
        }
        
        // Build the ORDER BY clause
        if (Object.keys(orderBy).length > 0) {
          query += ' ORDER BY ';
          const orderClauses = [];
          
          for (const [key, value] of Object.entries(orderBy)) {
            // Use double quotes to preserve column case
            orderClauses.push(`"${key}" ${value === 'desc' ? 'DESC' : 'ASC'}`);
          }
          
          query += orderClauses.join(', ');
        }
        
        // Add LIMIT
        query += ' LIMIT 1';
        
        // Execute the query
        const result = await pool.query(query, params);
        return result.rows[0] || null;
      } catch (error) {
        console.error('Error in findFirst:', error);
        throw error;
      }
    },
    
    count: async ({ where = {} } = {}) => {
      try {
        // Build the query
        let query = 'SELECT COUNT(*) FROM "conversion"';
        const params: any[] = [];
        let paramIndex = 1;
        
        // Build the WHERE clause
        if (Object.keys(where).length > 0) {
          query += ' WHERE ';
          const whereClauses = [];
          
          for (const [key, value] of Object.entries(where)) {
            if (value !== undefined) {
              whereClauses.push(`"${key}" = $${paramIndex++}`);
              params.push(value);
            }
          }
          
          query += whereClauses.join(' AND ');
        }
        
        // Execute the query
        const result = await pool.query(query, params);
        return parseInt(result.rows[0].count, 10);
      } catch (error) {
        console.error('Error in count:', error);
        throw error;
      }
    },
    
    create: async ({ data }) => {
      try {
        // Build the query
        const columns = Object.keys(data).map(key => `"${key}"`).join(', ');
        const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
        const values = Object.values(data);
        
        const query = `
          INSERT INTO "conversion" (${columns})
          VALUES (${placeholders})
          RETURNING *
        `;
        
        // Execute the query
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        console.error('Error in create:', error);
        throw error;
      }
    },
    
    update: async ({ where, data }) => {
      try {
        if (!where || Object.keys(where).length === 0) {
          throw new Error('Where clause is required for update');
        }
        
        // Build the SET part of the query
        const setColumns = Object.keys(data).map((key, index) => `"${key}" = $${index + 1}`);
        const setValues = Object.values(data);
        
        // Build the WHERE part of the query
        const whereStart = setValues.length + 1;
        const whereClauses = Object.keys(where).map((key, index) => `"${key}" = $${whereStart + index}`);
        const whereValues = Object.values(where);
        
        // Combine all values
        const allValues = [...setValues, ...whereValues];
        
        // Build the complete query
        const query = `
          UPDATE "conversion"
          SET ${setColumns.join(', ')}
          WHERE ${whereClauses.join(' AND ')}
          RETURNING *
        `;
        
        // Execute the query
        const result = await pool.query(query, allValues);
        return result.rows[0] || null;
      } catch (error) {
        console.error('Error in update:', error);
        throw error;
      }
    },
  },
  
  // Add other models as needed
  
  // Raw query execution
  $queryRaw: async (strings, ...values) => {
    try {
      // Handle both string queries and template literals
      let query;
      let params = [];
      
      if (typeof strings === 'string') {
        // Simple string query
        query = strings;
        params = values;
      } else if (Array.isArray(strings) && strings.raw) {
        // Tagged template literal
        query = strings.reduce((acc, str, i) => {
          return acc + str + (values[i] !== undefined ? `$${i + 1}` : '');
        }, '');
        params = values;
      } else {
        throw new Error('Invalid query format');
      }
      
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error in $queryRaw:', error);
      throw error;
    }
  },
  
  // Cleanup connection on process exit
  $disconnect: async () => {
    await pool.end();
  },
};

// Connect to database
export const connectDB = async () => {
  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('Connected to PostgreSQL database');
    return true;
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
    return false;
  }
};

// Export for use in the application
export { prisma as db }; 