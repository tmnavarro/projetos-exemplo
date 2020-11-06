import { InputType } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'Este campo é obrigatório.' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Este campo é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Este campo é obrigatório.' })
  password: string;
}
