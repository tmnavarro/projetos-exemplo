import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../common/test/TestUtil';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search all Users', () => {
    it('should be findAllUser', async () => {
      const user = TestUtil.giveMeAValidUser();

      mockRepository.find.mockReturnValue([user, user]);

      const users = await service.findAllUsers();

      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search user by Id', () => {
    it('should find a existing user', async () => {
      const user = TestUtil.giveMeAValidUser();

      mockRepository.findOne.mockReturnValue(user);

      const userFound = await service.findById('1');
      expect(userFound).toMatchObject({ id: '1', name: 'User Teste' });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a exeption when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findById('5')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('When create user', () => {
    it('should create a user', async () => {
      const user = TestUtil.giveMeAValidUser();

      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(user);

      const savedUser = await service.createUser(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should return exeption when doesnt create a user', async () => {
      const user = TestUtil.giveMeAValidUser();

      mockRepository.create.mockReturnValue(null);
      mockRepository.save.mockReturnValue(user);

      await service.createUser(user).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({ message: "Can't create user" });
      });

      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('When  update user', () => {
    it('should update a user', async () => {
      const user = TestUtil.giveMeAValidUser();
      const userUpdated = { name: 'User Updated' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({ ...user, ...userUpdated });
      mockRepository.create.mockReturnValue({ ...user, ...userUpdated });

      const savedUser = await service.updateUser('1', user);

      expect(savedUser).toMatchObject(userUpdated);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });

  describe('When delete user', () => {
    it('should update a user', async () => {
      const user = TestUtil.giveMeAValidUser();

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('should not delete a inexiting user', async () => {
      const user = TestUtil.giveMeAValidUser();

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(null);

      const deletedUser = await service.deleteUser('55');

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
