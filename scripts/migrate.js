#!/usr/bin/env node

/**
 * Script de migración para producción
 * Uso: node scripts/migrate.js
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    multipleStatements: true
  });

  try {
    console.log("🔍 Conectando a la base de datos...");
    
    // Asegurar que exista la tabla migrations
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Leer migraciones desde build/migrations
    const migrationsDir = path.join(__dirname, "../build/migrations");
    
    if (!fs.existsSync(migrationsDir)) {
      console.error("❌ No se encontró la carpeta de migraciones en build/migrations");
      console.log("💡 Asegúrate de haber ejecutado 'npm run build' primero");
      process.exit(1);
    }

    const files = fs.readdirSync(migrationsDir).sort();

    if (files.length === 0) {
      console.log("ℹ️  No hay migraciones para ejecutar");
      return;
    }

    // Buscar migraciones ya ejecutadas
    const [rows] = await connection.query("SELECT filename FROM migrations");
    const executed = new Set(rows.map(r => r.filename));

    let executedCount = 0;
    for (const file of files) {
      if (!executed.has(file)) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
        console.log(`🚀 Ejecutando migración: ${file}`);
        await connection.query(sql);
        await connection.query("INSERT INTO migrations (filename) VALUES (?)", [file]);
        executedCount++;
      } else {
        console.log(`⏭️  Saltando migración ya ejecutada: ${file}`);
      }
    }

    if (executedCount > 0) {
      console.log(`✅ ${executedCount} migración(es) completada(s)`);
    } else {
      console.log("ℹ️  Todas las migraciones ya están ejecutadas");
    }
  } catch (error) {
    console.error("❌ Error ejecutando migraciones:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigrations().catch(err => {
  console.error("❌ Error ejecutando migraciones:", err);
  process.exit(1);
});
