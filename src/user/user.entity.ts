import { Base } from '../utils/base'
import { Column, Entity, OneToMany } from 'typeorm'
import { VideoEntity } from '../video/video.entity'
import { SubscriptionEntity } from './subscription.entity'
import { LikedEntity } from './liked.entity'

@Entity('User')
export class UserEntity extends Base {
	@Column({ unique: true })
	email: string

	@Column({ select: false })
	password: string

	@Column({ default: '' })
	name: string

	@Column({ default: false, name: 'is_verified' })
	isVerified: boolean

	@Column({ default: 0, name: 'subscribers_count' })
	subscribersCount?: number

	@Column({ default: '', type: 'text' })
	description: string

	@Column({ default: '' })
	avatarPath: string

	@OneToMany(() => VideoEntity, video => video.user)
	videos: VideoEntity[]

	@OneToMany(() => SubscriptionEntity, sub => sub.fromUser)
	subscriptions: SubscriptionEntity[]

	@OneToMany(() => SubscriptionEntity, sub => sub.toUser)
	subscribers: SubscriptionEntity[]

	@OneToMany(() => LikedEntity, liked => liked.user)
	liked: LikedEntity[]
}
