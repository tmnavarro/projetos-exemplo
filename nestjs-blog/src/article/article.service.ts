import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { ArticleEntity } from 'src/entities/article.entity';
import { TagEntity } from 'src/entities/tag.entity';
import { UserEntity } from 'src/entities/user.entity';
import { FindAllQuery, FindFeedQuery } from 'src/user/dtos/user.dto';
import { Like, Repository } from 'typeorm';
import { CreateArticleDTO, UpdateArticleDTO } from './dtos/article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  private async upsertTags(tagList: string[]) {
    console.log(tagList);
    const foundTags = await this.tagRepository.find({
      where: tagList.map(t => ({
        tag: t,
      })),
    });

    console.log(foundTags);

    const newTags = tagList.filter(t => !foundTags.map(t => t.tag).includes(t));

    await Promise.all(
      this.tagRepository
        .create(newTags.map(t => ({ tag: t })))
        .map(t => t.save()),
    );
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }

  async findAll(user: UserEntity, query: FindAllQuery) {
    let findOptions: any = {
      where: {},
    };
    if (query.author) {
      findOptions.where['author.username'] = query.author;
    }
    if (query.favorited) {
      findOptions.where['favoritedBy.username'] = query.favorited;
    }
    if (query.tag) {
      findOptions.where.tagList = Like(`%${query.tag}%`);
    }
    if (query.offset) {
      findOptions.offset = query.offset;
    }
    if (query.limit) {
      findOptions.limit = query.limit;
    }
    console.log(findOptions);
    const articles = await this.articleRepository.find(findOptions);
    return articles.map(article => article.toArticle(user));
  }

  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { followee } = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['followee'],
    });

    const findOptions = {
      ...query,
      where: followee.map(follow => {
        author: follow.id;
      }),
    };
    return (await this.articleRepository.find(findOptions)).map(article =>
      article.toArticle(user),
    );
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepository.findOne({ where: { slug } });
    return article;
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = this.articleRepository.create(data);
    article.author = user;
    await this.upsertTags(data.tagList);
    const { slug } = await article.save();
    return (await this.articleRepository.findOne({ slug })).toArticle(user);
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }

    await this.articleRepository.update({ slug }, data);

    return article.toArticle(user);
  }

  async deteleArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepository.remove(article);
  }

  async favoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);

    article.favoritedBy.push(user);
    await article.save();

    return (await this.findBySlug(slug)).toArticle(user);
  }

  async unfavoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);

    article.favoritedBy = article.favoritedBy.filter(fav => fav.id !== user.id);
    await article.save();

    return (await this.findBySlug(slug)).toArticle(user);
  }
}
