import { classToPlain } from 'class-transformer';
import slugify from 'slugify';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
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
  @JoinColumn()
  favoritedBy: UserEntity[];

  @ManyToMany(
    type => UserEntity,
    user => user.articles,
    { eager: true },
  )
  author: UserEntity;

  @BeforeInsert()
  slugCreate() {
    this.slug = slugify(this.title, { lower: true });
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticle(user: UserEntity) {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.includes(user);
    }
    const article = this.toJSON();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
