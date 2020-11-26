import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromReques: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.APP_SECRET,
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    const user = await this.authService.validadeUser(payload);

    if (!user) {
      return done(
        new HttpException('Unathorized access', HttpStatus.UNAUTHORIZED),
        false,
      );
    }

    return done(null, user, payload.iat);
  }
}