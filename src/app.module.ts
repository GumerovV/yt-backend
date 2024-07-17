import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getTypeOrmConfig } from './config/typeorm.config'
import { VideoModule } from './video/video.module'
import { CommentModule } from './comment/comment.module'
import { AuthModule } from './auth/auth.module'
import { MediaModule } from './media/media.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'
import * as process from 'process'

@Module({
	imports: [
		UserModule,
		ConfigModule.forRoot(),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getTypeOrmConfig,
		}),
		ServeStaticModule.forRoot({
			rootPath: path.join(process.cwd(), '/uploads'),
			serveRoot: '/uploads',
		}),
		VideoModule,
		CommentModule,
		AuthModule,
		MediaModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
