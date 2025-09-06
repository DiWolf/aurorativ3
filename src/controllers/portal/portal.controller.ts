import { Request, Response } from "express";
import * as projectsQuery from "@queries/projects.query";

const renderError = (res: Response, view: string, title: string, status = 500, extra: object = {}) => {
  res.status(status).render(view, { title, ...extra });
};

export default {
  async index(req: Request, res: Response) {
    try {
      const projects = await projectsQuery.findLatestProjects(4);
      res.render("portal/index.njk", {
        title: "Inicio",
        projects,
      });
    } catch (error) {
      console.error("Error en index:", error);
      res.render("portal/index.njk", {
        title: "Inicio",
        projects: [],
      });
    }
  },

  async quiensoy(req: Request, res: Response) {
    try {
      const projects = await projectsQuery.findLatestProjects();
      res.render("portal/quien-soy.njk", {
        title: "Quién soy",
        projects,
      });
    } catch (error) {
      console.error("Error en quiensoy:", error);
      res.render("portal/quien-soy.njk", {
        title: "Quién soy",
        projects: [],
      });
    }
  },

  async casosExito(req: Request, res: Response) {
    try {
      const page = Number.isNaN(Number(req.query.page)) ? 1 : parseInt(req.query.page as string, 10) || 1;
      const limit = 7; // 1 destacado + 6 en cards
      const { rows: projects = [], total = 0 } = await projectsQuery.findProjectsPaginated(page, limit);

      const feature = projects.length > 0 ? projects[0] : null;
      const others = projects.length > 1 ? projects.slice(1) : [];

      const totalPages = Math.max(1, Math.ceil(total / limit));

      res.render("portal/casos-exito.njk", {
        title: "Casos de éxito",
        feature,
        projects: others,
        page,
        totalPages,
      });
    } catch (error) {
      console.error("Error en casosExito:", error);
      renderError(res, "portal/500.njk", "Error en el servidor");
    }
  },

  async casosExitoDetalle(req: Request, res: Response) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return renderError(res, "portal/404.njk", "Proyecto no encontrado", 404);
      }

      const project = await projectsQuery.findProjectBySlug(slug);

      if (!project) {
        return renderError(res, "portal/404.njk", "Proyecto no encontrado", 404);
      }

      const [technologies, images] = await Promise.all([
        projectsQuery.findProjectTechnologies(project.id),
        projectsQuery.findProjectImages(project.id),
      ]);

      res.render("portal/caso-exito-detalle.njk", {
        title: project.title,
        proyecto: project,
        technologies,
        imagenes: images,
      });
    } catch (error) {
      console.error("Error en casosExitoDetalle:", error);
      renderError(res, "portal/500.njk", "Error en el servidor");
    }
  },

  async comoTrabajo(req: Request, res: Response) {
    try {
      res.render("portal/como-trabajo.njk", {
        title: "Cómo trabajo",
      });
    } catch (error) {
      console.error("Error en comoTrabajo:", error);
      renderError(res, "portal/500.njk", "Error en el servidor");
    }
  },

  // Manejo de errores 404
  notFound(req: Request, res: Response) {
    renderError(res, "portal/404.njk", "Página no encontrada", 404);
  },

  // Manejo de errores 500
  serverError(req: Request, res: Response) {
    renderError(res, "portal/500.njk", "Error del servidor", 500);
  }
};
