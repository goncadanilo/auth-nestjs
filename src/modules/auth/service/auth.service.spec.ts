import { Test, TestingModule } from '@nestjs/testing';
import { TestUtil } from '../../../../test/utils/test.uttil';
import { CryptoService } from '../../../shared/services/crypto.service';
import { Users } from '../../users/entity/users.entity';
import { UsersService } from '../../users/service/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUser: Users;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
  };

  const mockCryptoService = {
    compareHash: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: CryptoService, useValue: mockCryptoService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUser = TestUtil.getMockUser();
  });

  beforeEach(() => {
    mockUsersService.findUserByEmail.mockReset();
    mockCryptoService.compareHash.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when validate user', () => {
    it('should validate user', async () => {
      mockUsersService.findUserByEmail.mockReturnValue(mockUser);
      mockCryptoService.compareHash.mockReturnValue(true);

      const result = await service.validateUser(
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

      const result = await service.validateUser(
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
});
