import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from '../../../../test/utils/test.uttil';
import { CryptoService } from '../../../shared/services/crypto.service';
import { Users } from '../entity/users.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUser: Users;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockCryptoService = {
    generateHash: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useValue: mockRepository },
        { provide: CryptoService, useValue: mockCryptoService },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    mockUser = TestUtil.getMockUser();
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.update.mockReset();
    mockCryptoService.generateHash.mockReset();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
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

      const savedUser = await usersService.createUser(user);

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

      const userFound = await usersService.findUserByEmail(mockUser.email);

      expect(userFound).toMatchObject(mockUser);
      expect(mockRepository.findOne).toBeCalledWith({ email: mockUser.email });
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('when update a user', () => {
    it('should update a existing user', async () => {
      const userEmailUpdate = {
        email: 'update@email.com',
      };

      mockRepository.findOne.mockReturnValue(mockUser);
      mockRepository.update.mockReturnValue({
        ...mockUser,
        ...userEmailUpdate,
      });
      mockRepository.create.mockReturnValue({
        ...mockUser,
        ...userEmailUpdate,
      });

      const updatedProduct = await usersService.updateUser(
        '1',
        userEmailUpdate,
      );

      expect(updatedProduct).toMatchObject(userEmailUpdate);
      expect(mockRepository.findOne).toBeCalledWith('1');
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledWith('1', userEmailUpdate);
      expect(mockRepository.update).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledWith({
        ...mockUser,
        ...userEmailUpdate,
      });
      expect(mockRepository.create).toBeCalledTimes(1);
    });

    it('should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);

      const userEmailUpdate = {
        email: 'update@email.com',
      };

      await usersService.updateUser('3', userEmailUpdate).catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toMatchObject({ message: 'User not found' });
        expect(mockRepository.findOne).toBeCalledWith('3');
        expect(mockRepository.findOne).toBeCalledTimes(1);
      });
    });
  });
});
