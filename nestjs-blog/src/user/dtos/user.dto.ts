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

export interface FindFeedQuery {
  limit?: number;
  offset?: number;
}

export interface FindAllQuery extends FindFeedQuery {
  tag?: string;
  author?: string;
  favorited?: string;
}
