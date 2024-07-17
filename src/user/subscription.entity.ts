import { UserEntity } from './user.entity'
import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from '../utils/base'

@Entity('Subscription')
export class SubscriptionEntity extends Base {
	@ManyToOne(() => UserEntity, user => user.subscriptions)
	@JoinColumn({ name: 'from_user_id' })
	fromUser: UserEntity

	@ManyToOne(() => UserEntity, user => user.subscribers)
	@JoinColumn({ name: 'to_user_id' })
	toUser: UserEntity
}
