import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { insertUser, findUserByEmail } from "@queries/users.query";

const SALT_ROUNDS = 10;

/**
 * GET /login
 * Renderiza la vista de login
 */
export async function showLogin(req: Request, res: Response) {
  res.render("auth/login.njk", { message: req.flash("error")[0] });
}

/**
 * POST /login
 * Procesa el formulario de login
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    req.flash("error", "Usuario o contraseña incorrectos");
    return res.redirect("/admin/auth/login");
  }

  const hash = "$2a$10$ymNc0YfZFDsK5nOpTZ28Ae2Py28u0Fdprc/Z1AEbUACGSNesTpRru";
const ok = await bcrypt.compare("admin123", hash);
console.log(ok); // debería imprimir true

  const valid = await bcrypt.compare(password, user.password_hash);
  console.log(valid);
  if (!valid) {
    req.flash("error", "Usuario o contraseña incorrectos");
    return res.redirect("/admin/auth/login");
  }

  // Guardar usuario en sesión
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.redirect("/admin/dashboard");
}

/**
 * GET /register
 * Renderiza la vista de registro
 */
export async function showRegister(req: Request, res: Response) {
  res.render("auth/register.njk", { message: req.flash("error") });
}

/**
 * POST /register
 * Procesa el registro de usuario
 */
export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const existing = await findUserByEmail(email);
  if (existing) {
    req.flash("error", "El correo ya está registrado");
    return res.redirect("/admin/auth/register");
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  await insertUser(name, email, hash);

  req.flash(
    "success",
    "Usuario registrado correctamente, ahora puedes iniciar sesión"
  );
  res.redirect("/admin/auth/login");
}

/**
 * GET /logout
 */
export async function logout(req: Request, res: Response) {
  req.session.destroy(() => {
    res.redirect("/admin/auth/login");
  });
}
