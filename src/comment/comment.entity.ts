import { Base } from '../utils/base'
import { UserEntity } from '../user/user.entity'
import { VideoEntity } from '../video/video.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity('Comment')
export class CommentEntity extends Base {
	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@ManyToOne(() => VideoEntity, video => video.comments)
	@JoinColumn({ name: 'video_id' })
	video: VideoEntity

	@Column({ type: 'text' })
	message: string
}
