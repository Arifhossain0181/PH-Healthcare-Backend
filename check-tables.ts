import "dotenv/config";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTables() {
  try {
    console.log("Checking database tables...");
    
    // Query the database directly to see what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log("Tables in database:", tables);
    
    // Also try to describe the user table structure
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'user' AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    console.log("\nUser table columns:", columns);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
