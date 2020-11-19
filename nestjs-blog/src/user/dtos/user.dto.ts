import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  username: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  image: string;
}
