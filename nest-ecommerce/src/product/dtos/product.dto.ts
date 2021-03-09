import { User } from 'src/types/user';

export interface CreateProductDTO {
  owner: User;
  title: string;
  description: string;
  image: string;
  price: number;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
