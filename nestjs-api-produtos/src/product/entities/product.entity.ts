import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @FilterableField()
  name: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @FilterableField()
  qtd: number;

  @CreateDateColumn()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => GraphQLISODateTime, { nullable: true })
  deletedAt: Date;
}
