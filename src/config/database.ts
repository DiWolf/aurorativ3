// src/config/database.ts
import 'dotenv/config';
import mysql, { Pool, PoolOptions, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

let pool: Pool;

function createPool(): Pool {
  const config: PoolOptions = {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? '',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_LIMIT ?? 10),
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: process.env.DB_TZ ?? 'Z', // 'Z' = UTC. Ej: 'local' o '+00:00'
    multipleStatements: true,
    // Si quieres fechas como string (no Date):
    // dateStrings: true,
    // Evitar convertir decimales a number (mantenerlos como string)
    // decimalNumbers: false,
    // Evitar multipleStatements a menos que lo necesites por seguridad
    // multipleStatements: false,
  };

  return mysql.createPool(config);
}

// Inicializa singleton
export function getPool(): Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

/**
 * Helper para consultas tipadas con parámetros.
 * Uso:
 *   const rows = await query<MyRow>('SELECT * FROM categories WHERE slug = ?', [slug]);
 */
// Reemplaza la versión anterior de query por esta:
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const [result] = await getPool().query(sql, params);
  return result as T;
}


/**
 * Cierre ordenado (tests / shutdown).
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = undefined as unknown as Pool;
  }
}

// Health check opcional (útil para levantar el server solo si hay DB)
export async function ping(): Promise<void> {
  await getPool().query('SELECT 1');
}
