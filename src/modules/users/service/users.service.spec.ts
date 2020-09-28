import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from '../../../../test/utils/test.uttil';
import { Users } from '../entity/users.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUser: Users;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUser = TestUtil.getMockUser();
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when create a user', () => {
    it('should be create a user', async () => {
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockReturnValue(mockUser);

      const user = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      };

      const savedUser = await service.createUser(user);

      expect(savedUser).toHaveProperty('id', 1);
      expect(savedUser).toMatchObject(mockUser);
      expect(mockRepository.create).toBeCalledWith(user);
      expect(mockRepository.save).toBeCalledWith(mockUser);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });
});
