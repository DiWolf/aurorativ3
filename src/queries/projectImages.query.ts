import { query } from "@config/database";

export type ProjectImageRow = {
  id: number;
  project_id: number;
  image_path: string;
  caption: string | null;
  created_at: string;
};

// Listar imágenes de un proyecto
export async function findImagesByProject(projectId: number): Promise<ProjectImageRow[]> {
  return await query<ProjectImageRow[]>(
    `SELECT id, project_id, image_path, caption, created_at
     FROM project_images
     WHERE project_id = ?
     ORDER BY created_at DESC`,
    [projectId]
  );
}

// Insertar imagen
export async function insertImage(data: { project_id: number; image_path: string; caption?: string; }) {
  return await query(
    `INSERT INTO project_images (project_id, image_path, caption)
     VALUES (?, ?, ?)`,
    [data.project_id, data.image_path, data.caption || null]
  );
}

// Buscar imagen por ID
export async function findImageById(id: number): Promise<ProjectImageRow | null> {
  const result = await query<ProjectImageRow[]>(
    `SELECT id, project_id, image_path, caption, created_at
     FROM project_images
     WHERE id = ?`,
    [id]
  );
  return result.length > 0 ? result[0] : null;
}

// Eliminar imagen
export async function deleteImage(id: number) {
  return await query(`DELETE FROM project_images WHERE id = ?`, [id]);
}
