import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { AuthCheck } from 'src/middlewares/auth.middleware';
import { UserService } from './user.service';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get('/:username')
  @UseGuards(new OptionalAuthGuard())
  async getProfile(
    @Param('username') username: string,
    @AuthCheck() currentUser: UserEntity,
  ) {
    const user = await this.userService.findByUsername(username, currentUser);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { profile: user };
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async followUser(
    @AuthCheck() currentUser: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.followUser(currentUser, username);
    return { profile };
  }
  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @AuthCheck() currentUser: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.unfollowUser(currentUser, username);
    return { profile };
  }
}
