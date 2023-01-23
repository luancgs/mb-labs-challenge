import { adminJwtConstants } from './admin.constants';
import { AdminJwtStrategy } from './admin.jwt.strategy';
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

  describe('Local strategy', () => {
    it('should be defined', () => {
      expect(AdminLocalStrategy).toBeDefined();
    });
  });
});
