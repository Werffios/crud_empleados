// src/middlewares/auth.middleware.test.js
import { jest } from '@jest/globals';

// Llama a unstable_mockModule antes de importar los módulos que dependan de jsonwebtoken.
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn(),
    sign: jest.fn()
  }
}));


const { default: jwt } = await import('jsonwebtoken');
const { verifyToken } = await import('../middlewares/auth.middleware.js');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: jest.fn() };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('should return 401 if no token is provided', () => {
    req.header.mockReturnValue(undefined);

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acceso denegado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next if token is valid', () => {
    const user = { id: 1, username: 'admin' };
    req.header.mockReturnValue('Bearer valid-token');
    jwt.verify.mockReturnValue(user);

    verifyToken(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  test('should return 401 if token is invalid', () => {
    req.header.mockReturnValue('Bearer invalid-token');
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
  });
});