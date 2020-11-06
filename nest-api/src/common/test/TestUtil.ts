import { User } from '../../user/user.entity';

export default class TestUtil {
  static giveMeAValidUser(): User {
    const user = new User();
    user.email = 'teste@teste.com';
    user.name = 'User Teste';
    user.id = '1';
    user.password = '123456';

    return user;
  }
}
