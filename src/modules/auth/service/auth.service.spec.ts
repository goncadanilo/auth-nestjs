import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TestUtil } from '../../../../test/utils/test.uttil';
import { CryptoService } from '../../../shared/services/crypto.service';
import { Users } from '../../users/entity/users.entity';
import { UsersService } from '../../users/service/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUser: Users;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
  };

  const mockCryptoService = {
    compareHash: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: CryptoService, useValue: mockCryptoService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    mockUser = TestUtil.getMockUser();
  });

  beforeEach(() => {
    mockUsersService.findUserByEmail.mockReset();
    mockCryptoService.compareHash.mockReset();
    mockJwtService.sign.mockReset();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('when validate user', () => {
    it('should validate user', async () => {
      mockUsersService.findUserByEmail.mockReturnValue(mockUser);
      mockCryptoService.compareHash.mockReturnValue(true);

      const result = await authService.validateUser(
        mockUser.email,
        mockUser.password,
      );

      expect(result).toHaveProperty('id', 1);
      expect(mockUsersService.findUserByEmail).toBeCalledWith(mockUser.email);
      expect(mockUsersService.findUserByEmail).toBeCalledTimes(1);
      expect(mockCryptoService.compareHash).toBeCalledWith(
        mockUser.password,
        mockUser.password,
      );
      expect(mockCryptoService.compareHash).toBeCalledTimes(1);
    });

    it('should retutn null if the user is invalid', async () => {
      mockUsersService.findUserByEmail.mockReturnValue(null);
      mockCryptoService.compareHash.mockReturnValue(false);

      const result = await authService.validateUser(
        mockUser.email,
        mockUser.password,
      );

      expect(result).toBe(null);
      expect(mockUsersService.findUserByEmail).toBeCalledWith(mockUser.email);
      expect(mockUsersService.findUserByEmail).toBeCalledTimes(1);
      expect(mockCryptoService.compareHash).toBeCalledWith(
        mockUser.password,
        undefined,
      );
      expect(mockCryptoService.compareHash).toBeCalledTimes(1);
    });
  });

  describe('when login', () => {
    it('should return an authentication token', async () => {
      mockJwtService.sign.mockReturnValue('valid_token');

      const user = {
        id: mockUser.id,
        email: mockUser.email,
      };

      const result = await authService.login(user);

      expect(result).toHaveProperty('token', 'valid_token');
      expect(mockJwtService.sign).toBeCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(mockJwtService.sign).toBeCalledTimes(1);
    });
  });
});
