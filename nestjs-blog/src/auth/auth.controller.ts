import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, LoginDTO, RegisterDTO } from './dtos/auth.dto';
import { ResponseObject } from './dtos/response.dto';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(@Body('user', ValidationPipe) credentials: RegisterDTO) {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  async login(@Body('user', ValidationPipe) credentials: LoginDTO) {
    const user = await this.authService.login(credentials);
    return { user };
  }
}
