// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test configuration
beforeAll(async () => {
  // Setup global test environment
  console.log('🧪 Setting up test environment...');
});

afterAll(async () => {
  // Cleanup after all tests
  console.log('🧹 Cleaning up test environment...');
});

// Mock console methods in test environment if needed
if (process.env.NODE_ENV === 'test') {
  // You can mock console.log, console.error, etc. here if needed for cleaner test output
}
