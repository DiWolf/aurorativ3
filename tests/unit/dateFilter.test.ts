/**
 * Tests for the date filter functionality
 */

describe('Date Filter', () => {
  // Recreate the date filter function from app.ts
  const createDateFilter = () => {
    return (value: any, pattern = "DD/MM/YYYY") => {
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
    };
  };

  let dateFilter: ReturnType<typeof createDateFilter>;

  beforeEach(() => {
    dateFilter = createDateFilter();
  });

  describe('Basic functionality', () => {
    test('should handle null/undefined values', () => {
      expect(dateFilter(null)).toBe('—');
      expect(dateFilter(undefined)).toBe('—');
      expect(dateFilter('')).toBe('—');
    });

    test('should handle invalid dates', () => {
      expect(dateFilter('invalid-date')).toBe('—');
      expect(dateFilter('not a date')).toBe('—');
    });

    test('should handle Date objects', () => {
      const testDate = new Date('2024-09-15T12:00:00');
      expect(dateFilter(testDate, 'd MMMM, yyyy')).toBe('15 septiembre, 2024');
    });

    test('should handle date strings', () => {
      expect(dateFilter('2024-09-15T12:00:00', 'd MMMM, yyyy')).toBe('15 septiembre, 2024');
      expect(dateFilter('2024-12-25T12:00:00', 'd MMMM, yyyy')).toBe('25 diciembre, 2024');
    });
  });

  describe('Date format patterns', () => {
    const testDate = new Date('2024-09-05T12:00:00'); // 5 de septiembre de 2024

    test('should format days correctly', () => {
      expect(dateFilter(testDate, 'd')).toBe('5');
      expect(dateFilter(testDate, 'DD')).toBe('05');
    });

    test('should format months correctly', () => {
      expect(dateFilter(testDate, 'M')).toBe('9');
      expect(dateFilter(testDate, 'MM')).toBe('09');
      expect(dateFilter(testDate, 'MMMM')).toBe('septiembre');
    });

    test('should format years correctly', () => {
      expect(dateFilter(testDate, 'yyyy')).toBe('2024');
      expect(dateFilter(testDate, 'YYYY')).toBe('2024');
      expect(dateFilter(testDate, 'yy')).toBe('24');
      expect(dateFilter(testDate, 'YY')).toBe('24');
    });

    test('should handle complex patterns', () => {
      expect(dateFilter(testDate, 'd MMMM, yyyy')).toBe('5 septiembre, 2024');
      expect(dateFilter(testDate, 'd de MMMM de yyyy')).toBe('5 de septiembre de 2024');
      expect(dateFilter(testDate, 'DD/MM/YYYY')).toBe('05/09/2024');
      expect(dateFilter(testDate, 'MMMM d, yyyy')).toBe('septiembre 5, 2024');
    });
  });

  describe('Month names in Spanish', () => {
    test('should return correct Spanish month names', () => {
      const months = [
        { date: '2024-01-15T12:00:00', expected: 'enero' },
        { date: '2024-02-15T12:00:00', expected: 'febrero' },
        { date: '2024-03-15T12:00:00', expected: 'marzo' },
        { date: '2024-04-15T12:00:00', expected: 'abril' },
        { date: '2024-05-15T12:00:00', expected: 'mayo' },
        { date: '2024-06-15T12:00:00', expected: 'junio' },
        { date: '2024-07-15T12:00:00', expected: 'julio' },
        { date: '2024-08-15T12:00:00', expected: 'agosto' },
        { date: '2024-09-15T12:00:00', expected: 'septiembre' },
        { date: '2024-10-15T12:00:00', expected: 'octubre' },
        { date: '2024-11-15T12:00:00', expected: 'noviembre' },
        { date: '2024-12-15T12:00:00', expected: 'diciembre' },
      ];

      months.forEach(({ date, expected }) => {
        expect(dateFilter(date, 'MMMM')).toBe(expected);
      });
    });
  });

  describe('Edge cases', () => {
    test('should handle leap year dates', () => {
      expect(dateFilter('2024-02-29T12:00:00', 'd MMMM, yyyy')).toBe('29 febrero, 2024');
    });

    test('should handle year 2000 (Y2K)', () => {
      expect(dateFilter('2000-01-01T12:00:00', 'd MMMM, yyyy')).toBe('1 enero, 2000');
    });

    test('should handle single digit dates and months', () => {
      expect(dateFilter('2024-01-01T12:00:00', 'd/M/yyyy')).toBe('1/1/2024');
      expect(dateFilter('2024-01-01T12:00:00', 'DD/MM/yyyy')).toBe('01/01/2024');
    });

    test('should preserve literal text in patterns', () => {
      expect(dateFilter('2024-09-15T12:00:00', 'Fecha: d de MMMM del yyyy')).toBe('Fecha: 15 de septiembre del 2024');
    });
  });

  describe('Default pattern', () => {
    test('should use DD/MM/YYYY as default pattern', () => {
      expect(dateFilter('2024-09-15T12:00:00')).toBe('15/09/2024');
    });
  });
});
