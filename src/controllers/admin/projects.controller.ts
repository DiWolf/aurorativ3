// src/controllers/adminProjects.controller.ts
import { Request, Response } from "express";
import * as projectsQuery from "@queries/projects.query";
import * as projectTecnologies from "@queries/projectTechnologies.query";
import * as projectImagesQuery from "@queries/projectImages.query";
// Añade al inicio del archivo si no está:
import fs from "fs";
import path from "path";

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
      // Con upload.fields(), el archivo main_image está en req.files.main_image[0]
      const main_image = req.files && (req.files as any).main_image && (req.files as any).main_image[0] 
        ? `/uploads/${(req.files as any).main_image[0].filename}` 
        : null;

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

      const [imagenes, technologies, projectTechnologies] = await Promise.all([
        projectImagesQuery.findImagesByProject(id),
        projectTecnologies.findAllTechnologies(),
        projectTecnologies.findTechnologiesByProject(id)
      ]);

      res.render("admin/projects/edit.njk", {
        proyecto,
        imagenes,
        technologies,
        projectTechnologies,
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
      const { client, title, description, resume, url, technologies } = req.body;

      // Traemos el proyecto actual
      const proyectoExistente = await projectsQuery.findProjectById(id);

      if (!proyectoExistente) {
        req.flash("error", "Proyecto no encontrado");
        return res.redirect("/admin/projects");
      }

      // Si hay archivo, usamos el nuevo; si no, dejamos el existente
      // Con upload.fields(), el archivo main_image está en req.files.main_image[0]
      const main_image = req.files && (req.files as any).main_image && (req.files as any).main_image[0]
        ? `/uploads/${(req.files as any).main_image[0].filename}`
        : proyectoExistente.main_image;

      await projectsQuery.updateProject(id, {
        client,
        title,
        description,
        resume,
        url,
        main_image,
      });

      // Actualizar tecnologías del proyecto
      if (technologies && Array.isArray(technologies)) {
        // Primero eliminamos todas las tecnologías actuales del proyecto
        await projectTecnologies.removeAllTechnologiesFromProject(id);
        // Luego agregamos las nuevas tecnologías seleccionadas
        await projectsQuery.insertProjectTechnologies(
          id,
          technologies.map(Number)
        );
      } else {
        // Si no se seleccionaron tecnologías, eliminamos todas
        await projectTecnologies.removeAllTechnologiesFromProject(id);
      }

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

  // Eliminar imagen adicional
  async destroyImage(req: Request, res: Response) {
    const imageId = Number(req.params.imageId);
    const projectId = Number(req.params.projectId);

    if (Number.isNaN(imageId) || Number.isNaN(projectId)) {
      console.warn('destroyImage: parámetros inválidos', { imageId: req.params.imageId, projectId: req.params.projectId });
      return res.status(400).json({ success: false, message: "Parámetros inválidos" });
    }

    try {
      // 1) Obtener la imagen para comprobar existencia y obtener el path
      // Asegúrate de que projectImagesQuery tenga una función equivalente a findImageById
      const img: any = await projectImagesQuery.findImageById(imageId);

      if (!img) {
        console.warn(`destroyImage: imagen ${imageId} no encontrada`);
        return res.status(404).json({ success: false, message: "Imagen no encontrada" });
      }

      // Verificar que la imagen pertenezca al proyecto indicado
      // Ajusta la propiedad según tu esquema: aquí supongo img.project_id
      if (Number(img.project_id) !== projectId) {
        console.warn(`destroyImage: la imagen ${imageId} no pertenece al proyecto ${projectId}`);
        return res.status(404).json({ success: false, message: "Imagen no encontrada en ese proyecto" });
      }

      // 2) Intentar borrar el archivo del filesystem (si existe)
      // Suponiendo que image_path tiene formato "/uploads/xxx.jpg" (como en tu insert)
      const imagePathStored: string = img.image_path || img.path || "";
      if (imagePathStored) {
        // Quitar leading slash si existe y resolver en carpeta /public
        const cleaned = imagePathStored.startsWith("/") ? imagePathStored.slice(1) : imagePathStored;
        const filePath = path.join(process.cwd(), "public", cleaned);

        try {
          await fs.promises.access(filePath, fs.constants.F_OK);
          await fs.promises.unlink(filePath);
          console.log(`destroyImage: archivo borrado -> ${filePath}`);
        } catch (fsErr) {
          // Si no existe el archivo no es crítico — solo lo registramos
          console.warn(`destroyImage: no se pudo borrar archivo (quizá no existe): ${filePath}`, (fsErr as Error).message);
        }
      } else {
        console.warn(`destroyImage: image_path vacío para imagen ${imageId}`);
      }

      // 3) Borrar registro en BD
      await projectImagesQuery.deleteImage(imageId);

      // 4) Responder JSON
      return res.json({ success: true, message: "Imagen eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      return res.status(500).json({ success: false, message: "Error al eliminar la imagen" });
    }
  }
}