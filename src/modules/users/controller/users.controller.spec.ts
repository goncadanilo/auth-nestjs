import { Test, TestingModule } from '@nestjs/testing';
import { TestUtil } from '../../../../test/utils/test.uttil';
import { Users } from '../entity/users.entity';
import { UsersService } from '../service/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUser: Users;

  const mockUsersService = {
    createUser: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    mockUser = TestUtil.getMockUser();
  });

  beforeEach(() => {
    mockUsersService.createUser.mockReset();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('when create a user', () => {
    it('should create a user and return it', async () => {
      mockUsersService.createUser.mockReturnValue(mockUser);

      const user = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      };

      const createdUser = await usersController.createUser(user);

      expect(createdUser).toMatchObject(mockUser);
      expect(mockUsersService.createUser).toBeCalledWith(user);
      expect(mockUsersService.createUser).toBeCalledTimes(1);
    });
  });
});
