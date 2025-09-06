import dotenv from "dotenv";
dotenv.config(); // Asegura que las variables de entorno se carguen
import i18n from "i18n";
import path from "path";
import express from "express";
import methodOverride from "method-override";
import nunjucks from "nunjucks";
import expressSession from "express-session";
import flash from "connect-flash"; // Importa connect-flash
import cookieParser from "cookie-parser"; // <--- ¡Asegúrate de tenerlo!
import fs from "fs";
//Middleware y utilidades
//import homeRoute from "@routes/portal.route";

//admin
import authRouter from "@routes/admin/auth.routes";
import adminProjectsRouter from "@routes/admin/adminProjects.route";

// portal 
import indexRouter from '@routes/portal/portal.router';
//import { mergeLocales } from "@utils/merge-locales";
//Rutas
const localesPath = path.join(__dirname, "../locales");
const app = express();
// Servir archivos estáticos desde /public

app.use("/public", express.static(path.join(__dirname, "..", "public")));

app.use(cookieParser()); // <-- antes que i18n.init
// i18n.configure({
//   locales: ["es", "en", "zh"],
//   defaultLocale: "en",
//   queryParameter: "lang",
//   cookie: "lang",
//   autoReload: true,
//   updateFiles: false,
//   objectNotation: true,
//   //staticCatalog: mergeLocales(localesPath),
// });
// app.use(i18n.init);

app.use("/public", express.static(path.join(__dirname, "..", "public")));
// Configuración de vistas con Nunjucks

app.use((req, res, next) => {
  if (req.query.lang && i18n.getLocales().includes(req.query.lang as string)) {
    res.cookie("lang", req.query.lang, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
    });
    req.setLocale(req.query.lang as string);
  }
  next();
});
app.set("view engine", "njk");
// const env = nunjucks.configure("src/views", {
//   autoescape: true,
//   express: app,
//   watch: true,
// });

// Configuración de vistas con Nunjucks
const env = nunjucks.configure(path.join(__dirname, ".", "views"), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== "production", // watch solo en dev
});

// Registrar como filtro para usar en la vista
env.addFilter("startsWith", function (value: any, prefix: string) {
  if (typeof value !== "string") return false;
  return value.startsWith(prefix);
});

// Configurar flash
app.use(flash()); // Habilitar connect-flash

// Middleware nativo de Express para parsear JSON
app.use(express.json()); // Para manejar solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Para manejar formularios URL-encoded
// Permite usar ?_method=PUT o ?_method=DELETE en formularios
app.use(methodOverride("_method"));
app.use(
  expressSession({
    secret: "mysecretkey", // Clave secreta para firmar las sesiones
    resave: false,
    saveUninitialized: true, // Asegúrate de no guardar sesiones vacías
    cookie: { secure: false }, // Para pruebas locales, debe ser true en producción
  })
);

// Filtro date: soporta múltiples formatos
env.addFilter("date", (value: any, pattern = "DD/MM/YYYY") => {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(+d)) return "—";
  
  const pad = (n: number) => String(n).padStart(2, "0");
  
  // Nombres de meses en español
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  
  const map: Record<string, string> = {
    // Días
    DD: pad(d.getDate()),
    d: String(d.getDate()),
    
    // Meses
    MM: pad(d.getMonth() + 1),
    M: String(d.getMonth() + 1),
    MMMM: monthNames[d.getMonth()],
    
    // Años
    YYYY: String(d.getFullYear()),
    yyyy: String(d.getFullYear()),
    YY: String(d.getFullYear()).slice(-2),
    yy: String(d.getFullYear()).slice(-2),
  };
  
  // Reemplazar patrones en orden de longitud (más largos primero)
  // Usamos word boundaries (\b) para evitar reemplazar letras dentro de palabras
  return pattern.replace(/\bYYYY\b|\byyyy\b|\bMMMM\b|\bMM\b|\bDD\b|\bYY\b|\byy\b|\bM\b|\bd\b/g, (match: string) => map[match] || match);
});

// ✅ año disponible en todas las vistas
env.addGlobal("year", new Date().getFullYear());

// Rutas
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.user = req.session.user || null; // 👈 aquí inyectas el usuario
  next();
});

app.use("/", indexRouter);

//app.use("/artemis/blog/categories",adminCategoriesRouter)
app.use("/admin/auth", authRouter);
app.use("/admin/projects", adminProjectsRouter);

// Manejo de 404 - debe ir al final de todas las rutas
app.use((req, res) => {
  res.status(404).render("portal/404.njk", {
    title: "Página no encontrada"
  });
});

// Manejo global de errores 500
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error interno del servidor:", error);
  res.status(500).render("portal/500.njk", {
    title: "Error del servidor"
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
