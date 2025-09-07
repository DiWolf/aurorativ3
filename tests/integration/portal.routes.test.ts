import request from 'supertest';
import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import portalRouter from '../../src/routes/portal/portal.router';

// Mock the database queries
jest.mock('../../src/queries/projects.query');

import * as projectsQuery from '../../src/queries/projects.query';
import { mockProjects, mockTechnologies, mockImages } from '../mocks/database.mock';

describe('Portal Routes Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    
    // Configure Nunjucks for testing
    const env = nunjucks.configure(path.join(__dirname, '../../src/views'), {
      autoescape: true,
      express: app,
      watch: false,
    });

    // Add the date filter
    env.addFilter("date", (value: any, pattern = "DD/MM/YYYY") => {
      if (!value) return "—";
      const d = value instanceof Date ? value : new Date(value);
      if (isNaN(+d)) return "—";
      
      const pad = (n: number) => String(n).padStart(2, "0");
      
      const monthNames = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ];
      
      const map: Record<string, string> = {
        DD: pad(d.getDate()),
        d: String(d.getDate()),
        MM: pad(d.getMonth() + 1),
        M: String(d.getMonth() + 1),
        MMMM: monthNames[d.getMonth()],
        YYYY: String(d.getFullYear()),
        yyyy: String(d.getFullYear()),
        YY: String(d.getFullYear()).slice(-2),
        yy: String(d.getFullYear()).slice(-2),
      };
      
      return pattern.replace(/YYYY|yyyy|MMMM|MM|DD|YY|yy|M|d/g, (match: string) => map[match] || match);
    });

    app.set('view engine', 'njk');
    app.use('/', portalRouter);

    // Add error handling middleware
    app.use((req, res) => {
      res.status(404).render('portal/404.njk', { title: 'Página no encontrada' });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    test('should render home page successfully', async () => {
      (projectsQuery.findLatestProjects as jest.Mock).mockResolvedValue(mockProjects.slice(0, 4));

      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Desarrollador Backend Freelance');
      expect(projectsQuery.findLatestProjects).toHaveBeenCalledWith(4);
    });

    test('should handle database errors gracefully', async () => {
      (projectsQuery.findLatestProjects as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Desarrollador Backend Freelance');
    });
  });

  describe('GET /quien-soy', () => {
    test('should render quien-soy page successfully', async () => {
      (projectsQuery.findLatestProjects as jest.Mock).mockResolvedValue(mockProjects);

      const response = await request(app)
        .get('/quien-soy')
        .expect(200);

      expect(response.text).toContain('Soy Francisco Javier');
      expect(projectsQuery.findLatestProjects).toHaveBeenCalledWith();
    });
  });

  describe('GET /casos-exito', () => {
    test('should render casos-exito page successfully', async () => {
      const paginatedResult = {
        rows: mockProjects,
        total: mockProjects.length,
      };

      (projectsQuery.findProjectsPaginated as jest.Mock).mockResolvedValue(paginatedResult);

      const response = await request(app)
        .get('/casos-exito')
        .expect(200);

      expect(response.text).toContain('Transformaciones que marcan la diferencia');
      expect(projectsQuery.findProjectsPaginated).toHaveBeenCalledWith(1, 7);
    });

    test('should handle pagination correctly', async () => {
      const paginatedResult = {
        rows: mockProjects.slice(0, 2),
        total: 10,
      };

      (projectsQuery.findProjectsPaginated as jest.Mock).mockResolvedValue(paginatedResult);

      const response = await request(app)
        .get('/casos-exito?page=2')
        .expect(200);

      expect(projectsQuery.findProjectsPaginated).toHaveBeenCalledWith(2, 7);
    });

    test('should handle database errors with 500 page', async () => {
      (projectsQuery.findProjectsPaginated as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/casos-exito')
        .expect(500);

      expect(response.text).toContain('Error interno del servidor');
    });
  });

  describe('GET /casos-exito/:slug', () => {
    test('should render project detail page successfully', async () => {
      const project = mockProjects[0];
      const technologies = mockTechnologies.filter(t => t.project_id === project.id);
      const images = mockImages.filter(i => i.project_id === project.id);

      (projectsQuery.findProjectBySlug as jest.Mock).mockResolvedValue(project);
      (projectsQuery.findProjectTechnologies as jest.Mock).mockResolvedValue(technologies);
      (projectsQuery.findProjectImages as jest.Mock).mockResolvedValue(images);

      const response = await request(app)
        .get(`/casos-exito/${project.slug}`)
        .expect(200);

      expect(response.text).toContain(project.title);
      expect(projectsQuery.findProjectBySlug).toHaveBeenCalledWith(project.slug);
      expect(projectsQuery.findProjectTechnologies).toHaveBeenCalledWith(project.id);
      expect(projectsQuery.findProjectImages).toHaveBeenCalledWith(project.id);
    });

    test('should return 404 for non-existent project', async () => {
      (projectsQuery.findProjectBySlug as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/casos-exito/non-existent-slug')
        .expect(404);

      expect(response.text).toContain('Página no encontrada');
    });

    test('should handle database errors with 500 page', async () => {
      (projectsQuery.findProjectBySlug as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/casos-exito/some-slug')
        .expect(500);

      expect(response.text).toContain('Error interno del servidor');
    });
  });

  describe('GET /como-trabajo', () => {
    test('should render como-trabajo page successfully', async () => {
      const response = await request(app)
        .get('/como-trabajo')
        .expect(200);

      expect(response.text).toContain('Cómo trabajo');
    });
  });

  describe('404 handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.text).toContain('Página no encontrada');
    });
  });
});
