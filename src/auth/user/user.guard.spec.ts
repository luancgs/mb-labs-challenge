import { userJwtConstants } from './user.constants';
import { UserJwtStrategy } from './user.jwt.strategy';
import { UserLocalStrategy } from './user.local.strategy';

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

  describe('Local strategy', () => {
    it('should be defined', () => {
      expect(UserLocalStrategy).toBeDefined();
    });
  });
});
