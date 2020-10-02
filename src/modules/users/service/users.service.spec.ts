import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from '../../../../test/utils/test.uttil';
import { CryptoService } from '../../../shared/services/crypto.service';
import { Users } from '../entity/users.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUser: Users;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCryptoService = {
    generateHash: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useValue: mockRepository },
        { provide: CryptoService, useValue: mockCryptoService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUser = TestUtil.getMockUser();
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.findOne.mockReset();
    mockCryptoService.generateHash.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when create a user', () => {
    it('should be create a user', async () => {
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockReturnValue(mockUser);
      mockCryptoService.generateHash.mockReturnValue(mockUser.password);

      const user = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      };

      const savedUser = await service.createUser(user);

      expect(savedUser).toHaveProperty('id', 1);
      expect(savedUser).toMatchObject(mockUser);
      expect(mockRepository.create).toBeCalledWith(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockCryptoService.generateHash).toBeCalledWith(mockUser.password);
      expect(mockCryptoService.generateHash).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledWith(mockUser);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('when search a user by email', () => {
    it('should find a user by email', async () => {
      mockRepository.findOne.mockReturnValue(mockUser);

      const userFound = await service.findUserByEmail(mockUser.email);

      expect(userFound).toMatchObject(mockUser);
      expect(mockRepository.findOne).toBeCalledWith({ email: mockUser.email });
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });
  });
});
