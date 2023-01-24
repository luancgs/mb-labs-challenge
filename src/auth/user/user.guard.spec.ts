import { userJwtConstants } from './user.constants';
import { UserJwtStrategy } from './user.jwt.strategy';
import { UserLocalStrategy } from './user.local.strategy';
import { UserJwtAuthGuard } from './user.jwt.auth.guard';
import { UserLocalAuthGuard } from './user.local.auth.guard';

describe('UserAuthModule', () => {
  describe('Jwt constants', () => {
    it('should be defined', () => {
      expect(userJwtConstants).toBeDefined();
      expect(userJwtConstants).toHaveProperty('secret');
    });
  });
  describe('Jwt strategy', () => {
    it('should be defined', () => {
      expect(UserJwtStrategy).toBeDefined();
    });
  });

  describe('Jwt Auth Guard', () => {
    it('should be defined', () => {
      expect(UserJwtAuthGuard).toBeDefined();
    });
  });

  describe('Local strategy', () => {
    it('should be defined', () => {
      expect(UserLocalStrategy).toBeDefined();
    });
  });

  describe('Local Auth Guard', () => {
    it('should be defined', () => {
      expect(UserLocalAuthGuard).toBeDefined();
    });
  });
});
