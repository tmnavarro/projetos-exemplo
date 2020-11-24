import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { AbstractEntity } from './abstract-entity';
import { ArticleEntity } from './article.entity';
import { type } from 'os';
import { CommentEntity } from './comment.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @ManyToMany(
    type => UserEntity,
    user => user.followee,
  )
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany(
    type => UserEntity,
    user => user.followers,
  )
  followee: UserEntity[];

  @OneToMany(
    type => ArticleEntity,
    article => article.author,
  )
  articles: ArticleEntity[];

  @OneToMany(
    type => CommentEntity,
    comment => comment.author,
  )
  comments: CommentEntity[];

  @ManyToMany(
    type => ArticleEntity,
    article => article.favoritedBy,
  )
  favorites: ArticleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

  toProfile(user?: UserEntity) {
    let following = null;
    if (user) {
      following = this.followers.includes(user);
    }
    const profile = this.toJSON();
    delete profile.followers;
    return { ...profile, following };
  }
}
