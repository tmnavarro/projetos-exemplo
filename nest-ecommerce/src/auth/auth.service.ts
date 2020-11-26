import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { Payload } from '../types/payload';
import { UserService } from '../shared/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async singPayload(payload: Payload) {
    return sign(payload, process.env.APP_SECRET, { expiresIn: '1w' });
  }

  async validadeUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }
}
