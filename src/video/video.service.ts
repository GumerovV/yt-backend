import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { VideoEntity } from './video.entity'
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm'
import { VideoDto } from './video.dto'
import { LikedEntity } from '../user/liked.entity'

@Injectable()
export class VideoService {
	constructor(
		@InjectRepository(VideoEntity)
		private readonly videoRepository: Repository<VideoEntity>,
		@InjectRepository(LikedEntity)
		private readonly likedRepository: Repository<LikedEntity>,
	) {}

	async getById(id: number, isPublic: boolean = false) {
		const video = await this.videoRepository.findOne({
			where: isPublic
				? {
						id,
						isPublic: true,
					}
				: {
						id,
					},
			relations: {
				user: true,
				comments: {
					user: true,
				},
			},
			select: {
				id: true,
				name: true,
				views: true,
				likesCount: true,
				description: true,
				videoPath: true,
				createdAt: true,
				updatedAt: true,
				isPublic: true,
				thumbnailPath: true,
				user: {
					id: true,
					name: true,
					email: true,
					avatarPath: true,
					isVerified: true,
					subscribersCount: true,
				},
				comments: {
					id: true,
					message: true,
					user: {
						id: true,
						name: true,
						email: true,
						avatarPath: true,
						isVerified: true,
						subscribersCount: true,
					},
				},
			},
		})

		if (!video) throw new NotFoundException('Видео не найдено!')
		return video
	}

	async getAll(searchTerm?: string) {
		let options: FindOptionsWhereProperty<VideoEntity> = {}

		if (searchTerm)
			options = {
				name: ILike(`%${searchTerm}%`),
			}

		return await this.videoRepository.find({
			where: { ...options, isPublic: true },
			order: {
				views: 'DESC',
			},
			relations: {
				user: true,
				comments: {
					user: true,
				},
			},
			select: {
				user: {
					id: true,
					name: true,
					avatarPath: true,
					isVerified: true,
					email: true,
				},
			},
		})
	}

	async getMostPopular() {
		return await this.videoRepository.find({
			where: { isPublic: true, views: MoreThan(0) },
			relations: {
				user: true,
			},
			select: {
				user: {
					id: true,
					name: true,
					isVerified: true,
					avatarPath: true,
					email: true,
				},
			},
			order: {
				views: -1,
			},
		})
	}

	async update(id: number, dto: VideoDto) {
		const video = await this.getById(id)
		return await this.videoRepository.save({ ...video, ...dto })
	}

	async create(userId: number) {
		let defualtValue = {
			name: '',
			user: { id: userId },
			videoPath: '',
			description: '',
			thumbnailPath: '',
		}

		const newVideo = this.videoRepository.create(defualtValue)
		const video = await this.videoRepository.save(newVideo)
		return video.id
	}

	async delete(id: number) {
		return await this.videoRepository.delete({ id })
	}

	async updateLikes(userId: number, id: number) {
		const video = await this.getById(id, true)

		if (!video) throw new NotFoundException('Видео не найдено!')

		const data = {
			user: { id: userId },
			video: { id },
		}

		const likedVideo = await this.likedRepository.findOneBy(data)

		if (!likedVideo) {
			const newLike = this.likedRepository.create(data)
			video.likesCount += 1
			await this.videoRepository.save(video)
			return await this.likedRepository.save(newLike)
		}

		video.likesCount -= 1
		await this.videoRepository.save(video)

		return await this.likedRepository.delete(data)
	}

	async updateViews(id: number) {
		const video = await this.getById(id)

		if (!video) throw new NotFoundException('Видео не найдено!')

		video.views += 1

		return await this.videoRepository.save(video)
	}
}
