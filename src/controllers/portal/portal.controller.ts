import { Request, Response } from "express";
import * as projectsQuery from "@queries/projects.query";

export default {
  async index(req: Request, res: Response) {
    try {
      const projects = await projectsQuery.findLatestProjects(4); // 👈 máximo 4
      res.render("portal/index.njk", {
        title: "Inicio",
        projects,
      });
    } catch (error) {
      console.error(error);
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
      console.error(error);
      res.render("portal/quien-soy.njk", {
        title: "Quién soy",
        projects: [],
      });
    }
  },
  async casosExito(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 7; // 1 destacado + 6 en cards
    const { rows: projects, total } = await projectsQuery.findProjectsPaginated(
      page,
      limit
    );

    const feature = projects[0] || null;
    const others = projects.slice(1);

    const totalPages = Math.ceil(total / limit);

    res.render("portal/casos-exito.njk", {
      title: "Casos de éxito",
      feature,
      projects: others,
      page,
      totalPages,
    });
  },
  async casosExitoDetalle(req: Request, res: Response) {
    try {
      const slug = req.params.slug;
      const project = await projectsQuery.findProjectBySlug(slug);

      if (!project) {
        return res.status(404).render("portal/404.njk", {
          title: "Proyecto no encontrado",
        });
      }

      const technologies = await projectsQuery.findProjectTechnologies(
        project.id
      );
      const images = await projectsQuery.findProjectImages(project.id);

      res.render("portal/caso-exito-detalle.njk", {
        title: project.title,
        proyecto: project,     // 👈 aquí
         technologies,
        imagenes: images,      // 👈 aquí
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .render("portal/500.njk", { title: "Error en el servidor" });
    }
  },
  async comoTrabajo(req: Request, res: Response){
    res.render("portal/como-trabajo.njk")
  }
};
