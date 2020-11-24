import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './dtos/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async findByArticleSlug(slug: string) {
    return await this.commentRepository.find({
      where: { 'article.slug': slug },
      relations: ['article'],
    });
  }

  async findById(id: number) {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async createComment(
    user: UserEntity,
    article: ArticleEntity,
    data: CreateCommentDTO,
  ) {
    const comment = this.commentRepository.create(data);
    comment.author = user;
    comment.article = article;
    await comment.save();
    return comment;
  }

  async deleteComment(user: UserEntity, id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, 'author.id': user.id },
    });
    await comment.remove();
    return comment;
  }
}
