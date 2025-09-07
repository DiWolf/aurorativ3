import { Router } from "express";
import portalController from "@controllers/portal/portal.controller";
const router = Router(); 

router.get("/",portalController.index);
router.get("/quien-soy",portalController.quiensoy);
router.get("/casos-exito",portalController.casosExito);
router.get("/casos-exito/:slug", portalController.casosExitoDetalle);
router.get("/como-trabajo",portalController.comoTrabajo);
router.get("/contacto",portalController.contacto);
router.get("/club-empresarial",portalController.clubEmpresarial);
router.get("/oferta-septiembre",portalController.ofertaSeptiembre);
export default router;