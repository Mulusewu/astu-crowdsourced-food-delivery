import rawDb from "./database.json";
import type { PrismaDatabase } from "@/types/prisma";

/**
 * Prisma-compatible local dataset used for UI testing.
 * Data-derivation helpers should live inside the relevant Zustand store
 * (customer/delivery/vendor/cart/auth) to avoid duplicated architectures.
 */
export const db = rawDb as PrismaDatabase;
export default db;
