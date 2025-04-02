const { execSync } = require('child_process');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function runCustomMigration() {
  try {
    console.log('Running custom migration to add updatedAt field to conversion table');
    
    // Connect to PostgreSQL database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    // Read the SQL migration file
    const migrationSql = fs.readFileSync(
      path.join(__dirname, 'add_updated_at.sql'),
      'utf8'
    );
    
    // Execute the SQL
    await pool.query(migrationSql);
    
    console.log('Migration completed successfully!');
    
    // Close the connection
    await pool.end();
    
    // Regenerate Prisma client
    console.log('Regenerating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Database migration and Prisma client update complete.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runCustomMigration(); 