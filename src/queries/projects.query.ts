import { query } from "@config/database";
import slugify from "slugify";

export type ProjectRow = {
  id: number;
  client: string;
  title: string;
  slug: string;
  description: string | null;
  resume: string | null;
  main_image: string | null;
  url: string | null;
  created_at: string; // o Date según tu driver
};

/**
 * Listar todos los proyectos
 */
export async function findAllProjects(): Promise<ProjectRow[]> {
  return await query<ProjectRow[]>(`
    SELECT id, client, title, slug, description, resume, main_image, url, created_at
    FROM projects
    ORDER BY created_at DESC
  `);
}

/**
 * Buscar proyecto por ID
 */
export async function findProjectById(id: number): Promise<ProjectRow | null> {
  const rows = await query<ProjectRow[]>(
    `SELECT id, client, title, slug, description, resume, main_image, url, created_at
     FROM projects WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Insertar nuevo proyecto
 */
export async function insertProject(data: {
  client: string;
  title: string;
  description?: string;
  resume?: string | null;
  main_image?: string | null;
  url?: string | null;
}) {
  const slug = slugify(data.title, { lower: true, strict: true });

  return await query(
    `INSERT INTO projects (client, title, slug, description, resume, main_image, url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.client,
      data.title,
      slug,
      data.description || null,
      data.resume || null,
      data.main_image || null,
      data.url || null,
    ]
  );
}

/**
 * Actualizar proyecto existente
 */
export async function updateProject(
  id: number,
  data: {
    client: string;
    title: string;
    description?: string;
    resume?: string | null;
    main_image?: string | null;
    url?: string | null;
  }
) {
  const slug = slugify(data.title, { lower: true, strict: true });

  return await query(
    `UPDATE projects
     SET client = ?, title = ?, slug = ?, description = ?, resume = ?, main_image = ?, url = ?
     WHERE id = ?`,
    [
      data.client,
      data.title,
      slug,
      data.description || null,
      data.resume || null,
      data.main_image || null,
      data.url || null,
      id,
    ]
  );
}

/**
 * Eliminar proyecto
 */
export async function deleteProject(id: number) {
  return await query(`DELETE FROM projects WHERE id = ?`, [id]);
}

/**
 * Insertar tecnologías relacionadas con un proyecto
 */
export async function insertProjectTechnologies(
  projectId: number,
  techIds: number[]
) {
  if (techIds.length === 0) return;

  const values = techIds.map((id) => [projectId, id]);
  return await query(
    `INSERT INTO project_technologies (project_id, technology_id) VALUES ?`,
    [values]
  );
}

export async function findAllTechnologies() {
  return await query("SELECT id, name FROM technologies ORDER BY name ASC");
}

/**
 * Últimos N proyectos (solo client, title, slug y resume)
 */
export async function findLatestProjects(limit: number = 4) {
  return await query<{ client: string; title: string; slug: string; resume: string | null }[]>(
    `SELECT client, title, slug, resume,main_image
     FROM projects
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );
}

/**
 * Proyectos con paginación
 */
export async function findProjectsPaginated(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const rows = await query<ProjectRow[]>(
    `SELECT id, client, title, slug, description, resume, main_image, url, created_at
     FROM projects
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [{ count }] = await query<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM projects`
  );

  return { rows, total: count };
}

// Buscar proyecto por slug
export async function findProjectBySlug(slug: string) {
  const rows = await query<ProjectRow[]>(
    `SELECT id, client, title, slug, description, resume, main_image, url, created_at
     FROM projects WHERE slug = ?`,
    [slug]
  );
  return rows[0] || null;
}

// Tecnologías de un proyecto
export async function findProjectTechnologies(projectId: number) {
  return await query<{ id: number; name: string }[]>(
    `SELECT t.id, t.name
     FROM project_technologies pt
     JOIN technologies t ON pt.technology_id = t.id
     WHERE pt.project_id = ?`,
    [projectId]
  );
}

// Imágenes adicionales de un proyecto
export async function findProjectImages(projectId: number) {
  return await query<{ id: number; image_url: string }[]>(
    `SELECT id, image_path
     FROM project_images
     WHERE project_id = ?`,
    [projectId]
  );
}
