import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { AuthCheck } from 'src/middlewares/auth.middleware';
import { UpdateUserDTO } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@AuthCheck() { username }: UserEntity) {
    const user = await this.userService.findByUsername(username);
    return { user };
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @AuthCheck() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: { user: UpdateUserDTO },
  ) {
    const user = await this.userService.updateUser(username, data.user);
    return { user };
  }
}
