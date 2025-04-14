// __mocks__/database.js
import { jest } from '@jest/globals';

export const pool = {
  query: jest.fn()
};