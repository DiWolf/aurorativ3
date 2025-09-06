/**
 * Database mocks for testing
 */

export const mockProjects = [
  {
    id: 1,
    title: 'Sistema de Gestión Municipal',
    slug: 'sistema-gestion-municipal',
    client: 'Ayuntamiento de Lázaro Cárdenas',
    resume: 'Sistema integral para la gestión de trámites y servicios municipales.',
    description: 'Desarrollo completo de un sistema web para la gestión de trámites ciudadanos...',
    main_image: '/uploads/proyecto1.jpg',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Portal de Transparencia',
    slug: 'portal-transparencia',
    client: 'Gobierno del Estado',
    resume: 'Portal web para la publicación de información gubernamental.',
    description: 'Implementación de portal de transparencia siguiendo las normativas...',
    main_image: '/uploads/proyecto2.jpg',
    created_at: new Date('2024-02-10'),
    updated_at: new Date('2024-02-10'),
  },
  {
    id: 3,
    title: 'E-commerce Artesanías',
    slug: 'ecommerce-artesanias',
    client: 'Cooperativa de Artesanos',
    resume: 'Plataforma de comercio electrónico para productos artesanales.',
    description: 'Desarrollo de tienda en línea con catálogo de productos...',
    main_image: '/uploads/proyecto3.jpg',
    created_at: new Date('2024-03-05'),
    updated_at: new Date('2024-03-05'),
  },
];

export const mockTechnologies = [
  { id: 1, name: 'Node.js', project_id: 1 },
  { id: 2, name: 'TypeScript', project_id: 1 },
  { id: 3, name: 'MySQL', project_id: 1 },
  { id: 4, name: 'Express.js', project_id: 1 },
  { id: 5, name: 'React', project_id: 2 },
  { id: 6, name: 'PostgreSQL', project_id: 2 },
];

export const mockImages = [
  { id: 1, url: '/uploads/img1.jpg', project_id: 1, alt: 'Dashboard principal' },
  { id: 2, url: '/uploads/img2.jpg', project_id: 1, alt: 'Módulo de usuarios' },
  { id: 3, url: '/uploads/img3.jpg', project_id: 2, alt: 'Página de inicio' },
];

export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@aurorati.mx',
    password: '$2b$10$hashed_password',
    created_at: new Date('2024-01-01'),
  },
];

/**
 * Mock database connection
 */
export const mockDatabase = {
  query: jest.fn(),
  execute: jest.fn(),
  end: jest.fn(),
};

/**
 * Helper functions for testing
 */
export const createMockPaginatedResult = (items: any[], total: number, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    rows: items.slice(startIndex, endIndex),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const resetMocks = () => {
  jest.clearAllMocks();
};
