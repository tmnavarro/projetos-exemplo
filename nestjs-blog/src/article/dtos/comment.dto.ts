import { IsNotEmpty } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  body: string;
}
