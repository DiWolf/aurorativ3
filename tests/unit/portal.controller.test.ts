import { Request, Response } from 'express';
import portalController from '../../src/controllers/portal/portal.controller';

// Mock the queries module
jest.mock('../../src/queries/projects.query', () => ({
  findLatestProjects: jest.fn(),
  findProjectsPaginated: jest.fn(),
  findProjectBySlug: jest.fn(),
  findProjectTechnologies: jest.fn(),
  findProjectImages: jest.fn(),
}));

import * as projectsQuery from '../../src/queries/projects.query';

describe('Portal Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('index', () => {
    test('should render index page with latest projects', async () => {
      const mockProjects = [
        { id: 1, title: 'Test Project 1', slug: 'test-1' },
        { id: 2, title: 'Test Project 2', slug: 'test-2' },
      ];

      (projectsQuery.findLatestProjects as jest.Mock).mockResolvedValue(mockProjects);

      await portalController.index(mockRequest as Request, mockResponse as Response);

      expect(projectsQuery.findLatestProjects).toHaveBeenCalledWith(4);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/index.njk', {
        title: 'Inicio',
        projects: mockProjects,
      });
    });

    test('should handle errors gracefully and render with empty projects', async () => {
      (projectsQuery.findLatestProjects as jest.Mock).mockRejectedValue(new Error('Database error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await portalController.index(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalledWith('Error en index:', expect.any(Error));
      expect(mockResponse.render).toHaveBeenCalledWith('portal/index.njk', {
        title: 'Inicio',
        projects: [],
      });

      consoleSpy.mockRestore();
    });
  });

  describe('quiensoy', () => {
    test('should render quien-soy page with latest projects', async () => {
      const mockProjects = [
        { id: 1, title: 'Test Project 1' },
      ];

      (projectsQuery.findLatestProjects as jest.Mock).mockResolvedValue(mockProjects);

      await portalController.quiensoy(mockRequest as Request, mockResponse as Response);

      expect(projectsQuery.findLatestProjects).toHaveBeenCalledWith();
      expect(mockResponse.render).toHaveBeenCalledWith('portal/quien-soy.njk', {
        title: 'Quién soy',
        projects: mockProjects,
      });
    });

    test('should handle errors and render with empty projects', async () => {
      (projectsQuery.findLatestProjects as jest.Mock).mockRejectedValue(new Error('Database error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await portalController.quiensoy(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalledWith('Error en quiensoy:', expect.any(Error));
      expect(mockResponse.render).toHaveBeenCalledWith('portal/quien-soy.njk', {
        title: 'Quién soy',
        projects: [],
      });

      consoleSpy.mockRestore();
    });
  });

  describe('casosExito', () => {
    test('should render casos-exito page with paginated projects', async () => {
      const mockPaginatedResult = {
        rows: [
          { id: 1, title: 'Featured Project', slug: 'featured' },
          { id: 2, title: 'Other Project 1', slug: 'other-1' },
          { id: 3, title: 'Other Project 2', slug: 'other-2' },
        ],
        total: 10,
      };

      (projectsQuery.findProjectsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResult);

      mockRequest.query = { page: '2' };

      await portalController.casosExito(mockRequest as Request, mockResponse as Response);

      expect(projectsQuery.findProjectsPaginated).toHaveBeenCalledWith(2, 7);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/casos-exito.njk', {
        title: 'Casos de éxito',
        feature: mockPaginatedResult.rows[0],
        projects: mockPaginatedResult.rows.slice(1),
        page: 2,
        totalPages: 2, // Math.ceil(10 / 7)
      });
    });

    test('should default to page 1 when no page query parameter', async () => {
      const mockPaginatedResult = {
        rows: [],
        total: 0,
      };

      (projectsQuery.findProjectsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResult);

      mockRequest.query = {};

      await portalController.casosExito(mockRequest as Request, mockResponse as Response);

      expect(projectsQuery.findProjectsPaginated).toHaveBeenCalledWith(1, 7);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/casos-exito.njk', {
        title: 'Casos de éxito',
        feature: null,
        projects: [],
        page: 1,
        totalPages: 1,
      });
    });

    test('should handle invalid page numbers', async () => {
      const mockPaginatedResult = { rows: [], total: 0 };
      (projectsQuery.findProjectsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResult);

      mockRequest.query = { page: 'invalid' };

      await portalController.casosExito(mockRequest as Request, mockResponse as Response);

      expect(projectsQuery.findProjectsPaginated).toHaveBeenCalledWith(1, 7);
    });

    test('should handle database errors', async () => {
      (projectsQuery.findProjectsPaginated as jest.Mock).mockRejectedValue(new Error('Database error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await portalController.casosExito(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalledWith('Error en casosExito:', expect.any(Error));
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/500.njk', { title: 'Error en el servidor' });

      consoleSpy.mockRestore();
    });
  });

  describe('casosExitoDetalle', () => {
    test('should render project detail page', async () => {
      const mockProject = { id: 1, title: 'Test Project', slug: 'test-project' };
      const mockTechnologies = [{ name: 'Node.js' }, { name: 'TypeScript' }];
      const mockImages = [{ url: '/image1.jpg' }, { url: '/image2.jpg' }];

      mockRequest.params = { slug: 'test-project' };

      (projectsQuery.findProjectBySlug as jest.Mock).mockResolvedValue(mockProject);
      (projectsQuery.findProjectTechnologies as jest.Mock).mockResolvedValue(mockTechnologies);
      (projectsQuery.findProjectImages as jest.Mock).mockResolvedValue(mockImages);

      await portalController.casosExitoDetalle(mockRequest as Request, mockResponse as Response);

      expect(projectsQuery.findProjectBySlug).toHaveBeenCalledWith('test-project');
      expect(projectsQuery.findProjectTechnologies).toHaveBeenCalledWith(1);
      expect(projectsQuery.findProjectImages).toHaveBeenCalledWith(1);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/caso-exito-detalle.njk', {
        title: 'Test Project',
        proyecto: mockProject,
        technologies: mockTechnologies,
        imagenes: mockImages,
      });
    });

    test('should return 404 when no slug provided', async () => {
      mockRequest.params = {};

      await portalController.casosExitoDetalle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/404.njk', { title: 'Proyecto no encontrado' });
    });

    test('should return 404 when project not found', async () => {
      mockRequest.params = { slug: 'non-existent' };

      (projectsQuery.findProjectBySlug as jest.Mock).mockResolvedValue(null);

      await portalController.casosExitoDetalle(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/404.njk', { title: 'Proyecto no encontrado' });
    });

    test('should handle database errors', async () => {
      mockRequest.params = { slug: 'test-project' };

      (projectsQuery.findProjectBySlug as jest.Mock).mockRejectedValue(new Error('Database error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await portalController.casosExitoDetalle(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalledWith('Error en casosExitoDetalle:', expect.any(Error));
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/500.njk', { title: 'Error en el servidor' });

      consoleSpy.mockRestore();
    });
  });

  describe('comoTrabajo', () => {
    test('should render como-trabajo page', async () => {
      await portalController.comoTrabajo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.render).toHaveBeenCalledWith('portal/como-trabajo.njk', {
        title: 'Cómo trabajo',
      });
    });

    test('should handle errors', async () => {
      // Force an error by mocking render to throw on first call, succeed on second
      let callCount = 0;
      (mockResponse.render as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Render error');
        }
        return; // Success on second call (for error page)
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await portalController.comoTrabajo(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalledWith('Error en comoTrabajo:', expect.any(Error));
      expect(mockResponse.render).toHaveBeenCalledTimes(2);
      expect(mockResponse.render).toHaveBeenNthCalledWith(1, 'portal/como-trabajo.njk', { title: 'Cómo trabajo' });
      expect(mockResponse.render).toHaveBeenNthCalledWith(2, 'portal/500.njk', { title: 'Error en el servidor' });

      consoleSpy.mockRestore();
    });
  });

  describe('notFound', () => {
    test('should render 404 page', () => {
      portalController.notFound(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/404.njk', { title: 'Página no encontrada' });
    });
  });

  describe('serverError', () => {
    test('should render 500 page', () => {
      portalController.serverError(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.render).toHaveBeenCalledWith('portal/500.njk', { title: 'Error del servidor' });
    });
  });
});
