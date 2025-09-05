import { query } from "@config/database";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "user";
  created_at: string; // o Date si configuras dateStrings = false en mysql2
  updated_at: string;
};

/**
 * Listado de usuarios (simple)
 */
export async function findAllUsers(): Promise<UserRow[]> {
  return await query<UserRow[]>(
    `SELECT id, name, email, role, created_at, updated_at
       FROM users
      ORDER BY created_at DESC`
  );
}

/**
 * Buscar usuario por ID
 */
export async function findUserById(id: number): Promise<UserRow | null> {
  const rows = await query<UserRow[]>(
    `SELECT id, name, email, password_hash, role, created_at, updated_at
       FROM users
      WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

/**
 * Buscar usuario por email (para login)
 */
export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const rows = await query<UserRow[]>(
    `SELECT id, name, email, password_hash, role, created_at, updated_at
       FROM users
      WHERE email = ?`,
    [email]
  );
  return rows[0] ?? null;
}

/**
 * Insertar usuario nuevo
 * - Recuerda hashear la contraseña ANTES de llamar a esta función
 */
export async function insertUser(
  name: string,
  email: string,
  passwordHash: string,
  role: "admin" | "user" = "user"
) {
  return await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role]
  );
}

/**
 * Actualizar usuario
 */
export async function updateUser(
  id: number,
  name: string,
  email: string,
  role: "admin" | "user"
) {
  return await query(
    `UPDATE users
        SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    [name, email, role, id]
  );
}

/**
 * Actualizar contraseña
 */
export async function updateUserPassword(id: number, passwordHash: string) {
  return await query(
    `UPDATE users
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    [passwordHash, id]
  );
}

/**
 * Eliminar usuario
 */
export async function deleteUser(id: number) {
  return await query(`DELETE FROM users WHERE id = ?`, [id]);
}
