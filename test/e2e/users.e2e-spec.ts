import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Users } from '../../src/modules/users/entity/users.entity';
import { UsersService } from '../../src/modules/users/service/users.service';
import { TestUtil } from '../utils/test.uttil';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let mockUser: Users;

  const mockUsersService = {
    createUser: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    mockUser = TestUtil.getMockUser();
  });

  beforeEach(() => {
    mockUsersService.createUser.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a user and return it with http code 201', async () => {
      mockUsersService.createUser.mockReturnValue(mockUser);

      const user = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(user);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).not.toHaveProperty('password');
      expect(response.status).toBe(201);
      expect(mockUsersService.createUser).toBeCalledWith(user);
      expect(mockUsersService.createUser).toBeCalledTimes(1);
    });
  });
});
