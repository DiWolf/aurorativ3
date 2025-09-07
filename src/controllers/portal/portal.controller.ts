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
        seo_title: "Desarrollador Backend Freelance en Lázaro Cárdenas | Francisco Javier - Aurora TI",
        seo_description: "Desarrollador backend freelance especializado en Node.js, TypeScript y desarrollo web. Creo sistemas empresariales robustos para empresas y gobiernos locales en Lázaro Cárdenas, Michoacán.",
        canonical_url: "https://aurorati.mx/",
        og_title: "Desarrollador Backend Freelance en Lázaro Cárdenas | Francisco Javier",
        og_description: "Desarrollador backend freelance especializado en Node.js, TypeScript y desarrollo web. Sistemas empresariales robustos para empresas y gobiernos locales.",
        og_url: "https://aurorati.mx/",
        projects,
      });
    } catch (error) {
      console.error("Error en index:", error);
      res.render("portal/index.njk", {
        title: "Inicio",
        seo_title: "Desarrollador Backend Freelance en Lázaro Cárdenas | Francisco Javier - Aurora TI",
        seo_description: "Desarrollador backend freelance especializado en Node.js, TypeScript y desarrollo web. Creo sistemas empresariales robustos para empresas y gobiernos locales en Lázaro Cárdenas, Michoacán.",
        canonical_url: "https://aurorati.mx/",
        og_title: "Desarrollador Backend Freelance en Lázaro Cárdenas | Francisco Javier",
        og_description: "Desarrollador backend freelance especializado en Node.js, TypeScript y desarrollo web. Sistemas empresariales robustos para empresas y gobiernos locales.",
        og_url: "https://aurorati.mx/",
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

  async contacto(req: Request, res: Response) {
    try {
      res.render("portal/contacto.njk", {
        title: "Contacto",
        seo_title: "Contacto - Desarrollador Backend Freelance | Francisco Javier - Aurora TI",
        seo_description: "Contacta con Francisco Javier, desarrollador backend freelance en Lázaro Cárdenas. Especializado en Node.js, TypeScript y desarrollo web. Consulta gratuita para tu proyecto.",
        canonical_url: "https://aurorati.mx/contacto",
        og_title: "Contacto - Desarrollador Backend Freelance | Francisco Javier",
        og_description: "Contacta con Francisco Javier, desarrollador backend freelance especializado en Node.js, TypeScript y desarrollo web. Consulta gratuita para tu proyecto.",
        og_url: "https://aurorati.mx/contacto",
      });
    } catch (error) {
      console.error("Error en contacto:", error);
      renderError(res, "portal/500.njk", "Error en el servidor");
    }
  },

  async clubEmpresarial(req: Request, res: Response) {
    try {
      res.render("portal/club-empresarial.njk", {
        title: "Club Empresarial",
        seo_title: "Oferta Exclusiva Club Empresarial | Desarrollador Backend Freelance | Francisco Javier",
        seo_description: "Oferta exclusiva para miembros del Club Empresarial. Páginas web profesionales con 25% de descuento, alojamiento incluido, correo empresarial y agentes IA. Solo para socios.",
        canonical_url: "https://aurorati.mx/club-empresarial",
        og_title: "Oferta Exclusiva Club Empresarial | Francisco Javier",
        og_description: "Oferta exclusiva para miembros del Club Empresarial. Páginas web profesionales con 25% de descuento, alojamiento incluido y agentes IA.",
        og_url: "https://aurorati.mx/club-empresarial",
      });
    } catch (error) {
      console.error("Error en clubEmpresarial:", error);
      renderError(res, "portal/500.njk", "Error en el servidor");
    }
  },

  async ofertaSeptiembre(req: Request, res: Response) {
    try {
      res.render("portal/oferta-septiembre.njk", {
        title: "Oferta Especial de Septiembre",
        seo_title: "Oferta Especial de Septiembre - 15% Descuento | Francisco Javier - Aurora TI",
        seo_description: "Aprovecha el 15% de descuento en páginas web profesionales este septiembre. Incluye hosting, dominio, correo empresarial y chatbot IA. ¡Oferta limitada!",
        canonical_url: "https://aurorati.mx/oferta-septiembre",
        og_title: "Oferta Especial de Septiembre - 15% Descuento | Francisco Javier",
        og_description: "Aprovecha el 15% de descuento en páginas web profesionales este septiembre. Incluye hosting, dominio, correo empresarial y chatbot IA.",
        og_url: "https://aurorati.mx/oferta-septiembre",
      });
    } catch (error) {
      console.error("Error en ofertaSeptiembre:", error);
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
