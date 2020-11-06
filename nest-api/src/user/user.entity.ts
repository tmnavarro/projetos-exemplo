import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { hasPasswordTransformer } from 'src/helper/crypto';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    transformer: hasPasswordTransformer,
  })
  @HideField()
  password: string;
}
