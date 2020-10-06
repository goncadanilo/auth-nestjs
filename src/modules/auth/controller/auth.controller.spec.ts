import { Test } from '@nestjs/testing';
import { TestUtil } from '../../../../test/utils/test.uttil';
import { Users } from '../../users/entity/users.entity';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let mockUser: Users;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    mockUser = TestUtil.getMockUser();
  });

  beforeEach(() => {
    mockAuthService.login.mockReset();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('when login', () => {
    it('should authentication user and return an authentication token', async () => {
      mockAuthService.login.mockReturnValue({ token: 'valid_token' });

      const user = {
        id: mockUser.id,
        email: mockUser.email,
      };

      const result = await authController.login(user);

      expect(result).toHaveProperty('token', 'valid_token');
      expect(mockAuthService.login).toBeCalledTimes(1);
    });
  });
});
