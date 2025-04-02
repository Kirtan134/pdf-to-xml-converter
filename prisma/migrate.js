const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function main() {
  try {
    // Generate Prisma client
    await runCommand('npx prisma generate');
    
    // Create migration
    await runCommand('npx prisma migrate dev --name init');
    
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Failed to migrate database:', error);
    process.exit(1);
  }
}

main(); 