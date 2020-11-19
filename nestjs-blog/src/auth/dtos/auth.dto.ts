import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsNotEmpty()
  @MinLength(4)
  username: string;
}

export interface AuthPayload {
  username: string;
}
