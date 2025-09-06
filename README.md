# 🌟 Aurora TI - Portfolio & Project Management Platform

![Tests](https://github.com/tu-usuario/artemisdev/workflows/Tests%20%26%20Quality%20Checks/badge.svg)
![Deploy](https://github.com/tu-usuario/artemisdev/workflows/Build%20%26%20Deploy%20to%20cPanel%20(FTP)/badge.svg)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

**Aurora TI** es una plataforma web profesional que combina un portafolio público con un sistema de gestión de proyectos. Desarrollada con Node.js, TypeScript y Nunjucks, ofrece una experiencia completa tanto para visitantes como para administradores.

## ✨ Características Principales

### 🌐 **Portal Público**
- **Portafolio profesional** con casos de éxito
- **Navegación intuitiva** (Inicio, Quién soy, Cómo trabajo, Casos de éxito)
- **Diseño responsive** con Bootstrap y componentes modernos
- **Sistema de paginación** para proyectos
- **SEO optimizado** con meta tags y URLs amigables

### 🔧 **Panel Administrativo**
- **Gestión completa de proyectos** (CRUD)
- **Sistema de autenticación** seguro con bcrypt
- **Subida de imágenes** con soporte para múltiples archivos
- **Gestión de tecnologías** por proyecto
- **Dashboard con métricas** y estadísticas

### 🎨 **Características Técnicas**
- **TypeScript** para type safety
- **Arquitectura MVC** bien estructurada
- **Templates Nunjucks** con layouts reutilizables
- **Base de datos MySQL** con pool de conexiones
- **Sistema de migraciones** automáticas
- **Testing completo** (unitarios e integración)
- **CI/CD** con GitHub Actions

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** >= 20.0.0
- **MySQL** >= 8.0
- **npm** o **yarn**

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/artemisdev.git
   cd artemisdev
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` con tus configuraciones:
   ```env
   # Base de datos
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=tu_usuario
   DB_PASS=tu_password
   DB_NAME=artemisdev
   
   # Sesiones
   SESSION_SECRET=tu_clave_secreta_muy_segura
   
   # Entorno
   NODE_ENV=development
   PORT=3000
   ```

4. **Ejecutar migraciones**
   ```bash
   npm run migrate
   ```

5. **Compilar estilos CSS**
   ```bash
   npm run build:css
   ```

6. **Iniciar en modo desarrollo**
   ```bash
   npm run start:dev
   ```

¡Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación!

## 📁 Estructura del Proyecto

```
artemisdev/
├── 📂 src/
│   ├── 📂 controllers/          # Controladores MVC
│   │   ├── 📂 admin/           # Controladores del admin
│   │   └── 📂 portal/          # Controladores del portal
│   ├── 📂 routes/              # Definición de rutas
│   ├── 📂 queries/             # Consultas a la base de datos
│   ├── 📂 views/               # Templates Nunjucks
│   │   ├── 📂 portal/          # Vistas del portal público
│   │   ├── 📂 admin/           # Vistas del panel admin
│   │   └── 📂 templates/       # Layouts base
│   ├── 📂 config/              # Configuraciones
│   ├── 📂 migrations/          # Migraciones de BD
│   └── 📄 app.ts               # Aplicación principal
├── 📂 public/                  # Archivos estáticos
│   ├── 📂 admin/               # Assets del admin
│   ├── 📂 front/               # Assets del portal
│   └── 📂 uploads/             # Archivos subidos
├── 📂 tests/                   # Suite de pruebas
│   ├── 📂 unit/                # Tests unitarios
│   ├── 📂 integration/         # Tests de integración
│   └── 📂 mocks/               # Mocks para testing
└── 📂 .github/                 # GitHub Actions workflows
```

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Ejecutar en producción (con migraciones) |
| `npm run start:dev` | Modo desarrollo con hot reload |
| `npm run build` | Compilar TypeScript y copiar vistas |
| `npm run build:css` | Compilar estilos SCSS |
| `npm run watch:css` | Watch mode para estilos |
| `npm run migrate` | Ejecutar migraciones de BD |
| `npm test` | Ejecutar todos los tests |
| `npm run test:unit` | Solo tests unitarios |
| `npm run test:integration` | Solo tests de integración |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run test:watch` | Tests en modo watch |

## 🧪 Testing

El proyecto incluye una suite completa de pruebas:

- **41 tests** en total
- **Cobertura del 100%** en controladores principales
- **Tests unitarios** para lógica de negocio
- **Tests de integración** para rutas completas
- **Mocks** para base de datos y servicios externos

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Modo watch para desarrollo
npm run test:watch
```

## 🏗️ Tecnologías Utilizadas

### **Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) **Node.js 20+**
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) **TypeScript 5.x**
- ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) **Express.js**
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) **MySQL 8.0**

### **Frontend**
- ![Nunjucks](https://img.shields.io/badge/Nunjucks-1C4913?style=flat&logo=nunjucks&logoColor=white) **Nunjucks Templates**
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white) **Bootstrap 4**
- ![Sass](https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white) **SCSS/Sass**
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **Vanilla JavaScript**

### **Testing & DevOps**
- ![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white) **Jest + Supertest**
- ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=github-actions&logoColor=white) **GitHub Actions CI/CD**
- ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white) **Docker Ready**

## 🔐 Seguridad

- **Autenticación** con bcrypt para hash de passwords
- **Sesiones** seguras con express-session
- **Validación** de datos en todas las entradas
- **SQL Injection** protección con prepared statements
- **CSRF** protección en formularios
- **Sanitización** de uploads de archivos

## 🚀 Deployment

### **Producción (cPanel)**
El proyecto incluye workflow automático para deployment:

1. **Push a `main`** → Trigger automático
2. **Tests ejecutados** → Solo deploy si pasan
3. **Build automático** → Compilación y optimización
4. **Deploy via FTP** → Subida automática a cPanel

### **Variables de Entorno para Producción**
```env
NODE_ENV=production
DB_HOST=tu_host_produccion
DB_NAME=tu_bd_produccion
SESSION_SECRET=clave_super_segura_produccion
```

## 📊 Métricas del Proyecto

- **~3,000 líneas** de código TypeScript
- **100% tipado** con TypeScript
- **41 tests** automatizados
- **Cobertura >90%** en código crítico
- **Performance Score A+** en GTmetrix
- **SEO Score 95+** en Lighthouse

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crear rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abrir Pull Request**

### **Estándares de Código**
- Usar **TypeScript** para todo el código
- **Tests obligatorios** para nuevas funcionalidades
- **Documentación** en código complejo
- **Commits descriptivos** en español

## 📝 Changelog

### **v1.0.0** (2024-01-15)
- ✅ Portal público completo
- ✅ Panel administrativo funcional
- ✅ Sistema de autenticación
- ✅ Gestión de proyectos y tecnologías
- ✅ Suite de tests completa
- ✅ CI/CD con GitHub Actions

## 📞 Contacto

**Francisco Javier Guerrero**  
🌐 [aurorati.mx](https://aurorati.mx)  
📧 [contacto@aurorati.mx](mailto:contacto@aurorati.mx)  
💼 [LinkedIn](https://linkedin.com/in/francisco-javier-guerrero)  
🐙 [GitHub](https://github.com/franciscojavierguerra)

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

Made with ❤️ by [Aurora TI](https://aurorati.mx)

</div>
