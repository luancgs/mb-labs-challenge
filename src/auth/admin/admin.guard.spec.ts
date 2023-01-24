import { adminJwtConstants } from './admin.constants';
import { AdminJwtAuthGuard } from './admin.jwt.auth.guard';
import { AdminJwtStrategy } from './admin.jwt.strategy';
import { AdminLocalAuthGuard } from './admin.local.auth.guard';
import { AdminLocalStrategy } from './admin.local.strategy';

describe('AdminAuthModule', () => {
  describe('Jwt constants', () => {
    it('should be defined', () => {
      expect(adminJwtConstants).toBeDefined();
      expect(adminJwtConstants).toHaveProperty('secret');
    });
  });
  describe('Jwt strategy', () => {
    it('should be defined', () => {
      expect(AdminJwtStrategy).toBeDefined();
    });
  });

  describe('Jwt Auth Guard', () => {
    it('should be defined', () => {
      expect(AdminJwtAuthGuard).toBeDefined();
    });
  });

  describe('Local strategy', () => {
    it('should be defined', () => {
      expect(AdminLocalStrategy).toBeDefined();
    });
  });

  describe('Local Auth Guard', () => {
    it('should be defined', () => {
      expect(AdminLocalAuthGuard).toBeDefined();
    });
  });
});
