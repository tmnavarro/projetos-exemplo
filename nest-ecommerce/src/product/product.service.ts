import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwError } from 'rxjs';
import { Product } from 'src/types/product';
import { User } from 'src/types/user';
import { CreateProductDTO, UpdateProductDTO } from './dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private productModel: Model<Product>,
  ) {}

  async findAll() {
    return await this.productModel.find().populate('owner');
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate('owner');
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async create(productDTO: CreateProductDTO, user: User): Promise<Product> {
    const product = new this.productModel({
      ...productDTO,
      owner: user,
    });
    await product.save();

    return product;
  }

  async update(id: string, productDTO: UpdateProductDTO): Promise<Product> {
    const product = await this.findOne(id);

    await product.updateOne(productDTO);

    return Object.assign(product.populate('owner'), productDTO);
  }

  async delete(id: string): Promise<void> {
    const product = await this.findOne(id);

    await product.remove();
    return;
  }
}
