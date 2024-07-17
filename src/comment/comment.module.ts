import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { VideoEntity } from '../video/video.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { CommentEntity } from './comment.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, VideoEntity, CommentEntity])],
	controllers: [CommentController],
	providers: [CommentService],
})
export class CommentModule {}
