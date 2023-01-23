import { JwtAuthGuard } from './jwt.auth.guard';
import { LocalAuthGuard } from './local.auth.guard';

describe('AuthService', () => {
  describe('jwt authentication guard general class', () => {
    it('should be defined', () => {
      expect(JwtAuthGuard).toBeDefined();
    });
  });
  describe('local authentication guard general class', () => {
    it('should be defined', () => {
      expect(LocalAuthGuard).toBeDefined();
    });
  });
});
