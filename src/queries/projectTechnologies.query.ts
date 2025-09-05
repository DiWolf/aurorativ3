import { query } from "@config/database";

export type TechnologyRow = {
  id: number;
  name: string;
};

// Listar todas las tecnologías
export async function findAllTechnologies(): Promise<TechnologyRow[]> {
  return await query<TechnologyRow[]>(`SELECT id, name FROM technologies ORDER BY name ASC`);
}

// Relacionar tecnología con proyecto
export async function addTechnologyToProject(projectId: number, technologyId: number) {
  return await query(
    `INSERT IGNORE INTO project_technologies (project_id, technology_id)
     VALUES (?, ?)`,
    [projectId, technologyId]
  );
}

// Quitar tecnología de proyecto
export async function removeTechnologyFromProject(projectId: number, technologyId: number) {
  return await query(
    `DELETE FROM project_technologies WHERE project_id = ? AND technology_id = ?`,
    [projectId, technologyId]
  );
}

// Listar tecnologías de un proyecto
export async function findTechnologiesByProject(projectId: number): Promise<TechnologyRow[]> {
  return await query<TechnologyRow[]>(
    `SELECT t.id, t.name
     FROM technologies t
     INNER JOIN project_technologies pt ON pt.technology_id = t.id
     WHERE pt.project_id = ?`,
    [projectId]
  );
}
