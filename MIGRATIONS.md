# Sistema de Migraciones

Este proyecto tiene un sistema de migraciones separado para desarrollo y producción.

## Desarrollo

Para ejecutar migraciones en desarrollo:

```bash
npm run migrate:dev
# o simplemente
npm run migrate
```

Esto ejecuta el script TypeScript desde `src/scripts/migrate.ts` y lee las migraciones desde `src/migrations/`.

## Producción

### Opción 1: Migración automática al iniciar

```bash
npm start
```

Esto ejecuta automáticamente las migraciones antes de iniciar la aplicación.

### Opción 2: Migración independiente

```bash
# Primero hacer build
npm run build

# Luego ejecutar migraciones
npm run migrate:standalone
```

### Opción 3: Migración desde build

```bash
npm run migrate:prod
```

## Estructura de Archivos

```
src/
├── migrations/           # Archivos SQL de migración (desarrollo)
│   ├── 001_create_users.sql
│   ├── 002_insert_admin_user.sql
│   └── ...
└── scripts/
    └── migrate.ts        # Script de migración para desarrollo

build/
├── migrations/           # Archivos SQL copiados para producción
│   ├── 001_create_users.sql
│   ├── 002_insert_admin_user.sql
│   └── ...
└── scripts/
    └── migrate.js        # Script compilado para desarrollo

scripts/
└── migrate.js            # Script independiente para producción
```

## Comandos Disponibles

- `npm run migrate:dev` - Ejecuta migraciones en desarrollo
- `npm run migrate:prod` - Ejecuta migraciones desde raíz (producción)
- `npm run migrate:standalone` - Ejecuta migraciones independientemente (producción)
- `npm run migrate:alt` - Ejecuta migraciones desde scripts/ (alternativa)
- `npm run migrate` - Alias para desarrollo
- `npm start` - Inicia la aplicación con migraciones automáticas (producción)
- `npm run start:dev` - Inicia en modo desarrollo con migraciones automáticas

## Scripts de Diagnóstico

- `node debug-migration.js` - Diagnostica problemas de rutas y estructura de carpetas

## Notas Importantes

1. **En desarrollo**: Usa `ts-node` para ejecutar el script TypeScript directamente
2. **En producción**: Los archivos SQL se copian a `build/migrations/` durante el build
3. **Migraciones independientes**: El script `scripts/migrate.js` puede ejecutarse sin iniciar la aplicación
4. **Seguridad**: Las migraciones se ejecutan en orden alfabético y se registran en la tabla `migrations`
