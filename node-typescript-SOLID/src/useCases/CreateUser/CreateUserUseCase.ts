import { User } from '../../entities/User';
import { IMailProvider } from '../../providers/IMailProvider';
import { IUsersRepository } from '../../repositories/IUsersRepository';

import { ICreateUserRequestDTO } from './CreateUserDTO';

export class CreateUserCase {
  constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute(data: ICreateUserRequestDTO) {
    const userExist = await this.usersRepository.findByEmail(data.email);

    if (userExist) {
      throw new Error('User alredy exist');
    }

    const user = new User(data);

    await this.usersRepository.save(user);
    await this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email,
      },
      from: {
        name: 'App Name',
        email: 'app@server.com',
      },
      subject: 'Seja bem vindo',
      body: 'Acesse agora',
    });
  }
}
