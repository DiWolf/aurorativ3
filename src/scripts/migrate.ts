import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    multipleStatements: true
  });

  // Asegurar que exista la tabla migrations
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Leer migraciones
  const migrationsDir = path.join(__dirname, "../migrations");
  const files = fs.readdirSync(migrationsDir).sort();

  // Buscar migraciones ya ejecutadas
  const [rows] = await connection.query("SELECT filename FROM migrations");
  const executed = new Set((rows as any[]).map(r => r.filename));

  for (const file of files) {
    if (!executed.has(file)) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      console.log(`🚀 Ejecutando migración: ${file}`);
      await connection.query(sql);
      await connection.query("INSERT INTO migrations (filename) VALUES (?)", [file]);
    }
  }

  await connection.end();
  console.log("✅ Migraciones completadas");
}

runMigrations().catch(err => {
  console.error("❌ Error ejecutando migraciones:", err);
  process.exit(1);
});
