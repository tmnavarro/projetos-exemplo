import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthPayload } from './dtos/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'), //fromAuthHeaderAsBearerToken
      secretOrKey: process.env.APP_SECRET,
    });
  }

  async validate(payload: AuthPayload) {
    const { username } = payload;
    const user = this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
