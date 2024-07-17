import { Base } from '../utils/base'
import { UserEntity } from '../user/user.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { CommentEntity } from '../comment/comment.entity'
import { LikedEntity } from '../user/liked.entity'

@Entity('Video')
export class VideoEntity extends Base {
	@Column()
	name: string

	@Column({ default: false, name: 'is_public' })
	isPublic: boolean

	@Column({ default: 0 })
	views?: number

	@OneToMany(() => LikedEntity, liked => liked.video)
	likes?: LikedEntity[]

	@Column({ default: 0, name: 'likes_count' })
	likesCount: number

	@Column({ default: 0 })
	duration?: number

	@Column({ default: '', type: 'text' })
	description: string

	@Column({ default: '', name: 'video_path' })
	videoPath: string

	@Column({ default: '', name: 'thumbnail_path' })
	thumbnailPath: string

	@ManyToOne(() => UserEntity, user => user.videos)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@OneToMany(() => CommentEntity, comment => comment.video)
	comments: CommentEntity[]
}
