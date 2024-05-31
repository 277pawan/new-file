import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { ApitokenCheckMiddleware } from './middleware/api-token-check.middleware';
import { ImguploadModule } from './imgupload/imgupload.module';
import { FolderStrucModule } from './folder-struc/folder-struc.module';
import { ShareFileModule } from './share-file/share-file.module';
import { CommentsModule } from './comment/comment.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.url),
    UsersModule,
    ImguploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/upload',
    }),
    FolderStrucModule,
    ShareFileModule,
    CommentsModule
  ],
  providers: [ApitokenCheckMiddleware], // Include ApitokenCheckMiddleware in providers
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApitokenCheckMiddleware)
      .exclude(
        { path: 'upload/(.*)', method: RequestMethod.ALL },
        { path: 'users', method: RequestMethod.ALL },
        { path: 'users/login', method: RequestMethod.ALL },
        { path: 'users/google', method: RequestMethod.ALL },
        { path: 'users/google/callback', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
