#!/usr/bin/env node

/**
 * Script de migración para producción - Versión desde raíz
 * Uso: node migrate.js
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Función para encontrar la carpeta de migraciones
function findMigrationsDir() {
  const possiblePaths = [
    path.join(process.cwd(), "build/migrations"),  // Desde raíz del proyecto
    path.join(process.cwd(), "src/migrations"),    // Fallback a src
    path.join(__dirname, "build/migrations"),      // Desde directorio actual
    path.join(__dirname, "src/migrations")         // Fallback desde directorio actual
  ];

  for (const migrationsPath of possiblePaths) {
    if (fs.existsSync(migrationsPath)) {
      console.log(`📁 Usando migraciones desde: ${migrationsPath}`);
      return migrationsPath;
    }
  }

  throw new Error(`❌ No se encontró la carpeta de migraciones. Rutas probadas: ${possiblePaths.join(", ")}`);
}

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
    console.log(`📂 Directorio actual: ${process.cwd()}`);
    console.log(`📂 Directorio del script: ${__dirname}`);
    
    // Asegurar que exista la tabla migrations
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Encontrar la carpeta de migraciones
    const migrationsDir = findMigrationsDir();

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
