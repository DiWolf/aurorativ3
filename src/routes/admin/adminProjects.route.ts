import { Router } from "express";
import adminProjectsController from "@controllers/admin/projects.controller";
import multer from "multer";
import path from "path";

// Configuración de multer para preservar extensiones
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    // Generar nombre único pero preservando la extensión
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});
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
