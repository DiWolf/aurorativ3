// src/controllers/adminProjects.controller.ts
import { Request, Response } from "express";
import * as projectsQuery from "@queries/projects.query";
import * as projectTecnologies from "@queries/projectTechnologies.query";
import * as projectImagesQuery from "@queries/projectImages.query";

export default {
  // Listar todos los proyectos
  async index(req: Request, res: Response) {
    try {
      const projects = await projectsQuery.findAllProjects();
      res.render("admin/projects/proyectos.njk", {
        projects,
        title: "Proyectos",
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "No se pudieron cargar los proyectos");
      res.redirect("/admin");
    }
  },

  // Mostrar formulario para crear proyecto
  async createForm(req: Request, res: Response) {
    const tecnologias = await projectTecnologies.findAllTechnologies();
    res.render("admin/projects/create.njk", {
      title: "Nuevo Proyecto",
      technologies: tecnologias,
    });
  },

  // Guardar nuevo proyecto
  async store(req: Request, res: Response) {
    try {
      const { client, title, description, resume, url, technologies } = req.body;
      const main_image = req.file ? `/uploads/${req.file.filename}` : null;

      const result = await projectsQuery.insertProject({
        client,
        title,
        description,
        resume,
        url,
        main_image,
      });

      const projectId = result.insertId;

      if (technologies && Array.isArray(technologies)) {
        await projectsQuery.insertProjectTechnologies(
          projectId,
          technologies.map(Number)
        );
      }

      // Manejar imágenes adicionales
      if (req.files && "extra_images" in req.files) {
        const extraImages = (req.files as any).extra_images;
        const imagesArray = Array.isArray(extraImages) ? extraImages : [extraImages];

        for (const img of imagesArray) {
          await projectImagesQuery.insertImage({
            project_id: projectId,
            image_path: `/uploads/${img.filename}`,
          });
        }
      }

      req.flash("success", "Proyecto creado correctamente");
      res.redirect("/admin/projects");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error al crear proyecto");
      res.redirect("/admin/projects/create");
    }
  },

  // Mostrar formulario de edición
  async editForm(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const proyecto = await projectsQuery.findProjectById(id);

      if (!proyecto) {
        req.flash("error", "Proyecto no encontrado");
        return res.redirect("/admin/projects");
      }

      const imagenes = await projectImagesQuery.findImagesByProject(id);

      res.render("admin/projects/edit.njk", {
        proyecto,
        imagenes,
        title: "Editar Proyecto",
      });
    } catch (error) {
      console.error(error);
      res.redirect("/admin/projects");
    }
  },

  // Actualizar proyecto
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { client, title, description, resume, url } = req.body;

      // Traemos el proyecto actual
      const proyectoExistente = await projectsQuery.findProjectById(id);

      if (!proyectoExistente) {
        req.flash("error", "Proyecto no encontrado");
        return res.redirect("/admin/projects");
      }

      // Si hay archivo, usamos el nuevo; si no, dejamos el existente
      const main_image = req.file
        ? `/uploads/${req.file.filename}`
        : proyectoExistente.main_image;

      await projectsQuery.updateProject(id, {
        client,
        title,
        description,
        resume,
        url,
        main_image,
      });

      // Manejar imágenes adicionales nuevas
      if (req.files && "extra_images" in req.files) {
        const extraImages = (req.files as any).extra_images;
        const imagesArray = Array.isArray(extraImages) ? extraImages : [extraImages];

        for (const img of imagesArray) {
          await projectImagesQuery.insertImage({
            project_id: id,
            image_path: `/uploads/${img.filename}`,
          });
        }
      }

      req.flash("success", "Proyecto actualizado correctamente");
      res.redirect("/admin/projects");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error al actualizar proyecto");
      res.redirect(`/admin/projects/${req.params.id}/edit`);
    }
  },

  // Eliminar proyecto
  async destroy(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await projectsQuery.deleteProject(id);

      req.flash("success", "Proyecto eliminado");
      res.redirect("/admin/projects");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error al eliminar proyecto");
      res.redirect("/admin/projects");
    }
  },
};
