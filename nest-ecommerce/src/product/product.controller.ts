import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SellerGuard } from 'src/guards/seller.guard';
import { User as UserDocument } from 'src/types/user';
import { User } from 'src/utils/user.decorator';
import { CreateProductDTO, UpdateProductDTO } from './dtos/product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async listAll() {
    return this.productService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async create(@Body() product: CreateProductDTO, @User() user: UserDocument) {
    console.log(user);
    return this.productService.create(product, user);
  }

  @Get(':id')
  async read(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  async update(@Param('id') id: string, @Body() product: UpdateProductDTO) {
    return this.productService.update(id, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), SellerGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
