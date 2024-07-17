import { Module } from '@nestjs/common'
import { VideoService } from './video.service'
import { VideoController } from './video.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { VideoEntity } from './video.entity'
import { CommentEntity } from '../comment/comment.entity'
import { LikedEntity } from '../user/liked.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			VideoEntity,
			CommentEntity,
			LikedEntity,
		]),
	],
	controllers: [VideoController],
	providers: [VideoService],
})
export class VideoModule {}
