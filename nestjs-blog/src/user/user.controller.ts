import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/entities/user.entity';
import { AuthCheck } from 'src/middlewares/auth.middleware';
import { UpdateUserDTO } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@AuthCheck() { username }: UserEntity) {
    const user = await this.authService.findCurrentUser(username);
    return { user };
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @AuthCheck() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: { user: UpdateUserDTO },
  ) {
    const user = await this.authService.updateUser(username, data.user);
    return { user };
  }
}
