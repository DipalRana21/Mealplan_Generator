import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// 1. Setup WebSocket for local development
neonConfig.webSocketConstructor = ws;

// 2. Get Connection String
const connectionString = process.env.DATABASE_URL!;

// 3. Setup Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// 4. Initialize Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}