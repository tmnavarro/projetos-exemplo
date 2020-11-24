import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { ArticleService } from './article.service';
import { CreateArticleDTO, UpdateArticleDTO } from './dtos/article.dto';
import { AuthCheck } from 'src/middlewares/auth.middleware';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { FindAllQuery, FindFeedQuery } from 'src/user/dtos/user.dto';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dtos/comment.dto';

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private commentService: CommentService,
  ) {}

  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(@AuthCheck() user: UserEntity, @Query() query: FindAllQuery) {
    const articles = await this.articleService.findAll(user, query);
    return { articles, articlesCount: articles.length };
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(@AuthCheck() user: UserEntity, @Query() query: FindFeedQuery) {
    const articles = await this.articleService.findFeed(user, query);
    return { articles, articlesCount: articles.length };
  }

  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(@Param('slug') slug: string, @AuthCheck() user: UserEntity) {
    const article = this.articleService.findBySlug(slug);
    return { article: (await article).toArticle(user) };
  }

  @Get('/:slug/comments')
  async findComments(@Param('slug') slug: string) {
    const comments = await this.commentService.findByArticleSlug(slug);
    return { comments };
  }

  @Post('/:slug/comments')
  @UseGuards(AuthGuard())
  async createComment(
    @Param('slug') slug: string,
    @AuthCheck() user: UserEntity,
    @Body(ValidationPipe) data: { comment: CreateCommentDTO },
  ) {
    const article = await this.articleService.findBySlug(slug);
    const comment = await this.commentService.createComment(
      user,
      article,
      data.comment,
    );
    return { comment };
  }

  @Delete('/:slug/comments/:id')
  @UseGuards(AuthGuard())
  async deleteComment(@Param('id') id: number, @AuthCheck() user: UserEntity) {
    const comment = await this.commentService.deleteComment(user, id);
    return { comment };
  }

  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @AuthCheck() user: UserEntity,
    @Body(ValidationPipe) data: { article: CreateArticleDTO },
  ) {
    const article = await this.articleService.createArticle(user, data.article);
    return { article };
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @AuthCheck() user: UserEntity,
    @Body(ValidationPipe) data: { article: UpdateArticleDTO },
  ) {
    const article = await this.articleService.updateArticle(
      slug,
      user,
      data.article,
    );
    return { article };
  }

  @Delete('/:slug')
  async deleteArticle(
    @Param('slug') slug: string,
    @AuthCheck() user: UserEntity,
  ) {
    const article = await this.articleService.deteleArticle(slug, user);
    return { article };
  }

  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(
    @AuthCheck() user: UserEntity,
    @Param('slug') slug: string,
  ) {
    const article = await this.articleService.favoriteArticle(slug, user);
    return { article };
  }

  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(
    @AuthCheck() user: UserEntity,
    @Param('slug') slug: string,
  ) {
    const article = await this.articleService.unfavoriteArticle(slug, user);
    return { article };
  }
}
