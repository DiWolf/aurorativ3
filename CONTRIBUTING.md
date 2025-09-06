# 🤝 Contribuir a Aurora TI

¡Gracias por tu interés en contribuir a Aurora TI! Este documento te guiará a través del proceso de contribución.

## 🚀 Primeros Pasos

### Prerrequisitos
- Node.js >= 20.0.0
- MySQL >= 8.0
- Git
- Editor de código (recomendado: VS Code)

### Configuración del Entorno

1. **Fork del repositorio**
   ```bash
   # Haz fork en GitHub y luego clona tu fork
   git clone https://github.com/TU-USUARIO/artemisdev.git
   cd artemisdev
   ```

2. **Configurar upstream**
   ```bash
   git remote add upstream https://github.com/USUARIO-ORIGINAL/artemisdev.git
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Configurar base de datos**
   ```bash
   # Copia y configura el archivo de entorno
   cp .env.example .env
   # Edita .env con tus configuraciones locales
   
   # Ejecuta las migraciones
   npm run migrate
   ```

5. **Ejecutar tests**
   ```bash
   npm test
   ```

## 📋 Proceso de Contribución

### 1. Crear una Issue
Antes de empezar a trabajar, crea o comenta en una issue existente para:
- Describir el problema o mejora
- Discutir la solución propuesta
- Evitar trabajo duplicado

### 2. Crear una Rama
```bash
# Actualiza tu main
git checkout main
git pull upstream main

# Crea una nueva rama descriptiva
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b bugfix/corregir-problema
# o
git checkout -b docs/actualizar-readme
```

### 3. Desarrollar
- Escribe código limpio y bien documentado
- Sigue las convenciones existentes
- Añade tests para nueva funcionalidad
- Actualiza documentación si es necesario

### 4. Testing
```bash
# Ejecuta todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Verifica que el build funcione
npm run build
```

### 5. Commit
Usa mensajes de commit descriptivos en español:
```bash
git add .
git commit -m "feat: añadir sistema de comentarios en proyectos"
# o
git commit -m "fix: corregir paginación en casos de éxito"
# o
git commit -m "docs: actualizar guía de instalación"
```

**Prefijos recomendados:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Documentación
- `style:` - Cambios de formato (no afectan funcionalidad)
- `refactor:` - Refactoring de código
- `test:` - Añadir o corregir tests
- `chore:` - Tareas de mantenimiento

### 6. Push y Pull Request
```bash
# Push a tu fork
git push origin feature/nueva-funcionalidad

# Crea Pull Request en GitHub
```

## 📝 Estándares de Código

### TypeScript
- **Tipado estricto**: Usa tipos explícitos
- **Interfaces**: Define interfaces para objetos complejos
- **Enums**: Para constantes relacionadas
- **Async/await**: Prefiere sobre Promises

```typescript
// ✅ Bueno
interface Project {
  id: number;
  title: string;
  slug: string;
  client: string;
  createdAt: Date;
}

async function getProject(id: number): Promise<Project | null> {
  const result = await query<Project[]>('SELECT * FROM projects WHERE id = ?', [id]);
  return result[0] || null;
}

// ❌ Malo
function getProject(id) {
  return query('SELECT * FROM projects WHERE id = ?', [id]).then(result => {
    return result[0];
  });
}
```

### Estructura de Archivos
- **Controladores**: Lógica de negocio en `src/controllers/`
- **Rutas**: Definición de endpoints en `src/routes/`
- **Queries**: Consultas SQL en `src/queries/`
- **Vistas**: Templates Nunjucks en `src/views/`
- **Tests**: Pruebas en `tests/` con estructura similar a `src/`

### Naming Conventions
- **Archivos**: `kebab-case.ts`
- **Variables/Funciones**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase`
- **Componentes**: `PascalCase`

### Base de Datos
- **Queries parametrizadas**: Siempre usar `?` placeholders
- **Transacciones**: Para operaciones múltiples
- **Validación**: En controladores antes de BD
- **Migraciones**: Para cambios de esquema

```typescript
// ✅ Bueno
async function createProject(data: CreateProjectData): Promise<number> {
  const { title, client, description } = data;
  const slug = slugify(title);
  
  const result = await query<ResultSetHeader>(
    'INSERT INTO projects (title, slug, client, description) VALUES (?, ?, ?, ?)',
    [title, slug, client, description]
  );
  
  return result.insertId;
}

// ❌ Malo
async function createProject(data) {
  const sql = `INSERT INTO projects (title, client) VALUES ('${data.title}', '${data.client}')`;
  return await query(sql);
}
```

## 🧪 Testing

### Tests Obligatorios
- **Nuevas funcionalidades**: Tests unitarios + integración
- **Bug fixes**: Test que reproduzca el bug + fix
- **Cambios en API**: Tests de endpoints

### Estructura de Tests
```typescript
describe('ProjectController', () => {
  describe('createProject', () => {
    test('should create project successfully', async () => {
      // Arrange
      const mockData = { title: 'Test Project', client: 'Test Client' };
      
      // Act
      const result = await controller.createProject(mockData);
      
      // Assert
      expect(result.id).toBeDefined();
      expect(result.title).toBe(mockData.title);
    });
    
    test('should handle validation errors', async () => {
      // Test error cases
    });
  });
});
```

## 🔍 Code Review

### Checklist para PR
- [ ] **Funcionalidad**: ¿Cumple los requisitos?
- [ ] **Tests**: ¿Están incluidos y pasan?
- [ ] **Documentación**: ¿Está actualizada?
- [ ] **Performance**: ¿No introduce lentitud?
- [ ] **Seguridad**: ¿No hay vulnerabilidades?
- [ ] **Compatibilidad**: ¿Funciona en diferentes entornos?

### Proceso de Review
1. **Auto-review**: Revisa tu propio código antes del PR
2. **Automated checks**: Deben pasar CI/CD
3. **Peer review**: Al menos una aprobación
4. **Testing**: Verificar en entorno de pruebas

## 🐛 Reportar Bugs

### Template de Bug Report
```markdown
**Descripción del Bug**
Descripción clara y concisa del problema.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer clic en '....'
3. Scrollear hasta '....'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que esperabas que pasara.

**Screenshots**
Si aplica, añade screenshots.

**Información del Entorno:**
 - OS: [e.g. Windows 10, macOS 12]
 - Navegador: [e.g. Chrome 96, Firefox 94]
 - Node.js: [e.g. 20.1.0]
 - Versión del proyecto: [e.g. 1.0.0]

**Información Adicional**
Cualquier otro contexto sobre el problema.
```

## 💡 Sugerir Mejoras

### Template de Feature Request
```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema. Ej: "Me frustra cuando [...]"

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que pase.

**Describe alternativas consideradas**
Descripción de soluciones alternativas.

**Información Adicional**
Screenshots, mockups, o contexto adicional.
```

## 📞 Contacto

¿Tienes preguntas? ¡Contáctanos!

- **Email**: [contacto@aurorati.mx](mailto:contacto@aurorati.mx)
- **GitHub Issues**: Para bugs y features
- **Discussions**: Para preguntas generales

## 🙏 Reconocimientos

Todos los contribuidores serán reconocidos en:
- README principal
- Página de créditos en el sitio web
- Release notes

¡Gracias por hacer Aurora TI mejor! 🌟
