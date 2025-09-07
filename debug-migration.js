#!/usr/bin/env node

/**
 * Script de diagnóstico para migraciones
 * Uso: node debug-migration.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 DIAGNÓSTICO DE MIGRACIONES");
console.log("================================");

console.log(`📂 Directorio actual: ${process.cwd()}`);
console.log(`📂 Directorio del script: ${__dirname}`);
console.log(`📂 __dirname relativo: ${path.relative(process.cwd(), __dirname)}`);

console.log("\n📁 ESTRUCTURA DE CARPETAS:");
console.log("==========================");

const checkPaths = [
  ".",
  "build",
  "build/migrations",
  "src",
  "src/migrations",
  "scripts",
  "migrate.js",
  "scripts/migrate.js"
];

checkPaths.forEach(checkPath => {
  const fullPath = path.resolve(checkPath);
  const exists = fs.existsSync(fullPath);
  const isDir = exists ? fs.statSync(fullPath).isDirectory() : false;
  const isFile = exists ? fs.statSync(fullPath).isFile() : false;
  
  console.log(`${exists ? "✅" : "❌"} ${checkPath.padEnd(20)} -> ${fullPath} ${isDir ? "(dir)" : isFile ? "(file)" : ""}`);
});

console.log("\n📄 ARCHIVOS DE MIGRACIÓN:");
console.log("=========================");

const migrationPaths = [
  "build/migrations",
  "src/migrations"
];

migrationPaths.forEach(migrationPath => {
  const fullPath = path.resolve(migrationPath);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    console.log(`📁 ${migrationPath}:`);
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  } else {
    console.log(`❌ ${migrationPath}: No existe`);
  }
});

console.log("\n🔧 VARIABLES DE ENTORNO:");
console.log("========================");
console.log(`NODE_ENV: ${process.env.NODE_ENV || "undefined"}`);
console.log(`DB_HOST: ${process.env.DB_HOST || "undefined"}`);
console.log(`DB_NAME: ${process.env.DB_NAME || "undefined"}`);

console.log("\n💡 COMANDOS SUGERIDOS:");
console.log("======================");
console.log("1. node migrate.js");
console.log("2. node scripts/migrate.js");
console.log("3. npm run migrate:prod");
console.log("4. npm run migrate:alt");
