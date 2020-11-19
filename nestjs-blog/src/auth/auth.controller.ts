import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dtos/auth.dto';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(@Body(ValidationPipe) credentials: { user: RegisterDTO }) {
    const user = await this.authService.register(credentials.user);
    return { user };
  }

  @Post('/login')
  async login(@Body(ValidationPipe) credentials: { user: LoginDTO }) {
    const user = await this.authService.login(credentials.user);
    return { user };
  }
}
