import { classToPlain } from 'class-transformer';
import slugify from 'slugify';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationCount,
} from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column('simple-array')
  tagList: string[];

  @ManyToMany(
    type => UserEntity,
    user => user.favorites,
    { eager: true },
  )
  @JoinTable()
  favoritedBy: UserEntity[];

  @OneToMany(
    type => CommentEntity,
    comment => comment.article,
    { eager: true },
  )
  comments: CommentEntity[];

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @ManyToOne(
    type => UserEntity,
    user => user.articles,
    { eager: true },
  )
  author: UserEntity;

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticle(user: UserEntity) {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.map(user => user.id).includes(user.id);
    }
    const article: any = this.toJSON();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
