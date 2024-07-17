import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { SubscriptionEntity } from './subscription.entity'
import { UserDto } from './user.dto'
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(SubscriptionEntity)
		private readonly subscriptionRepository: Repository<SubscriptionEntity>,
	) {}

	async getProfile(id: number) {
		let user = await this.userRepository.findOne({
			where: {
				id,
			},
			relations: {
				videos: true,
				subscriptions: {
					toUser: true,
				},
				liked: {
					video: {
						user: true,
					},
				},
			},
			order: {
				createdAt: 'DESC',
			},
		})

		if (!user) throw new NotFoundException('Пользователь не найден!')

		return user
	}

	async getById(id: number) {
		let user = await this.userRepository.findOne({
			where: {
				id,
			},
			relations: {
				videos: true,
				subscriptions: {
					toUser: true,
				},
			},
			order: {
				createdAt: 'DESC',
			},
		})

		if (!user) throw new NotFoundException('Пользователь не найден!')

		user.videos = user.videos.filter(video => video.isPublic === true)
		return user
	}

	async update(id: number, dto: UserDto) {
		const user = await this.getById(id)

		const candidate = await this.userRepository.findOneBy({ email: dto.email })

		if (candidate && candidate.id !== id)
			throw new BadRequestException('Данный email занят!')

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email
		user.name = dto.name
		user.description = dto.description
		user.avatarPath = dto.avatarPath
		user.isVerified = dto.isVerified

		return await this.userRepository.save(user)
	}

	async subscribe(fromUserId: number, toUserId: number) {
		if (fromUserId === toUserId)
			throw new BadRequestException('Ошибка подписки!')

		const data = {
			fromUser: { id: fromUserId },
			toUser: { id: toUserId },
		}

		const user = await this.getById(toUserId)
		const isSubscribed = await this.subscriptionRepository.findOneBy(data)

		if (!isSubscribed) {
			const newSub = this.subscriptionRepository.create(data)
			await this.subscriptionRepository.save(newSub)

			user.subscribersCount += 1
			await this.userRepository.save(user)

			return true
		}

		await this.subscriptionRepository.delete(data)
		user.subscribersCount -= 1
		await this.userRepository.save(user)
		return false
	}

	async getAll() {
		return await this.userRepository.find()
	}
}
