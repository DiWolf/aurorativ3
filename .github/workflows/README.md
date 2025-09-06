# GitHub Workflows

Este directorio contiene los workflows de GitHub Actions para el proyecto AuroraTI.

## Workflows Disponibles

### 🧪 `test.yml` - Tests & Quality Checks
**Trigger:** Push a `main`/`develop` y Pull Requests a `main`

**Jobs:**
- **test**: Ejecuta tests unitarios e integración en Node.js 20 y 22
- **lint**: Verifica tipos de TypeScript y compilación
- **security**: Auditoría de seguridad y dependencias

### 🚀 `main.yml` - Build & Deploy
**Trigger:** Push a `main`

**Jobs:**
- **test**: Ejecuta tests antes del deploy
- **deploy**: Deploy a cPanel via FTP (solo si tests pasan)

## Configuración de Secrets

Para que los workflows funcionen correctamente, configura estos secrets en GitHub:

### Para Deployment (main.yml)
```
FTP_SERVER=tu-servidor-ftp.com
FTP_USERNAME=tu-usuario-ftp
FTP_PASSWORD=tu-password-ftp
FTP_SERVER_DIR=/public_html/
```

### Para Coverage (test.yml) - Opcional
```
CODECOV_TOKEN=tu-token-de-codecov
```

## Badges para README

Puedes usar estos badges en tu README principal:

```markdown
![Tests](https://github.com/tu-usuario/artemisdev/workflows/Tests%20%26%20Quality%20Checks/badge.svg)
![Deploy](https://github.com/tu-usuario/artemisdev/workflows/Build%20%26%20Deploy%20to%20cPanel%20(FTP)/badge.svg)
```

## Dependabot

El archivo `dependabot.yml` mantiene automáticamente las dependencias actualizadas:
- **npm packages**: Revisión semanal los lunes
- **GitHub Actions**: Revisión semanal los lunes

## Pull Request Template

El template en `pull_request_template.md` ayuda a mantener PRs consistentes y completos.
