import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConnetionService } from './database-connetion.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { TagEntity } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnetionService,
    }),
    TypeOrmModule.forFeature([TagEntity]),
    AuthModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
