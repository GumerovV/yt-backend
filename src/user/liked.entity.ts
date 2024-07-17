import { Entity, ManyToOne } from 'typeorm'
import { UserEntity } from './user.entity'
import { VideoEntity } from '../video/video.entity'
import { Base } from '../utils/base'

@Entity('Liked')
export class LikedEntity extends Base {
	@ManyToOne(() => UserEntity, user => user.liked)
	user: UserEntity

	@ManyToOne(() => VideoEntity, video => video.likes)
	video: VideoEntity
}
