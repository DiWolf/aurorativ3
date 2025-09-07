import { Router } from "express";
import adminProjectsController from "@controllers/admin/projects.controller";
import multer from "multer";

const upload = multer({ dest: "public/uploads/" });
const router = Router();

// 📌 Listado de proyectos
router.get("/", adminProjectsController.index);

// 📌 Formulario de creación
router.get("/create", adminProjectsController.createForm);

// 📌 Guardar nuevo proyecto
router.post(
  "/",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "extra_images", maxCount: 10 }, // ✅ imágenes adicionales
  ]),
  adminProjectsController.store
);

// 📌 Eliminar imagen adicional (DEBE ir ANTES que las rutas con :id)
router.post("/:projectId/images/:imageId/delete", adminProjectsController.destroyImage);

// 📌 Formulario de edición
router.get("/:id/edit", adminProjectsController.editForm);

// 📌 Actualizar proyecto
router.post(
  "/:id/edit",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "extra_images", maxCount: 10 }, // ✅ imágenes adicionales
  ]),
  adminProjectsController.update
);

// 📌 Eliminar proyecto
router.post("/:id/delete", adminProjectsController.destroy);

export default router;
