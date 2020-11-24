import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/user/dtos/user.dto';
import { Repository } from 'typeorm';
import { AuthResponse, LoginDTO, RegisterDTO } from './dtos/auth.dto';
import { ResponseObject } from './dtos/response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private jwtService: JwtService,
  ) {}

  async getToken(user: UserEntity) {
    const payload = { username: user.username };
    const token = this.jwtService.sign(payload);
    return { ...user, token };
  }

  async findCurrentUser(username: string, currentUser?: UserEntity) {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return this.getToken(user);
  }

  async register(credentials: RegisterDTO) {
    try {
      const user = this.userRepository.create(credentials);
      await user.save();
      const payload = { username: credentials.username };
      const token = this.jwtService.sign(payload);
      return { ...user, token };
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('User has alredy been taken.');
      }
      throw new InternalServerErrorException();
    }
  }

  async login(credentials: LoginDTO) {
    try {
      const { email, password } = credentials;
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (user && (await user.comparePassword(password))) {
        const payload = { username: user.username };
        const token = this.jwtService.sign(payload);
        return { ...user, token };
      }
      return new UnauthorizedException('User or password is invalid');
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    username: string,
    data: UpdateUserDTO,
  ): Promise<AuthResponse> {
    await this.userRepository.update({ username }, data);
    const user = await this.findCurrentUser(username);

    return user;
  }
}
