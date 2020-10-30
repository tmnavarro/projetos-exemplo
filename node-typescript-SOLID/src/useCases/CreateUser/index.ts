import { MailtrapMailProvider } from '../../providers/implementations/MailtrapMailProvider';
import { FakeUsersRepository } from '../../repositories/implementations/FakeUsersRepository';
import { CreateUserController } from './CreateUserController';
import { CreateUserCase } from './CreateUserUseCase';

const mailtrapProvider = new MailtrapMailProvider();
const fakeUsersRepository = new FakeUsersRepository();

const createUserUseCase = new CreateUserCase(
  fakeUsersRepository,
  mailtrapProvider
);

const createUserController = new CreateUserController(createUserUseCase);

export { createUserController, createUserUseCase };
