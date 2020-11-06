import { InputType } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsUUID()
  @IsString()
  @IsNotEmpty({ message: 'Este campo é obrigatório.' })
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Este campo é obrigatório.' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty({ message: 'Este campo é obrigatório.' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Este campo é obrigatório.' })
  password?: string;
}
