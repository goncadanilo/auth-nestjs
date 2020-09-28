import { Users } from '../../src/modules/users/entity/users.entity';

export class TestUtil {
  static getMockUser(): Users {
    const user = new Users();
    user.id = 1;
    user.name = 'Any Name';
    user.email = 'any@email.com';
    user.password = 'any_password';
    user.createdAt = new Date();

    return user;
  }
}
