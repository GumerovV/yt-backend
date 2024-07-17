import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity } from './comment.entity'
import { Repository } from 'typeorm'
import { CommentDto } from './comment.dto'

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(CommentEntity)
		private readonly commentRepository: Repository<CommentEntity>,
	) {}

	async create(userId: number, dto: CommentDto) {
		const newComment = this.commentRepository.create({
			user: { id: userId },
			video: { id: dto.videoId },
			message: dto.message,
		})

		return await this.commentRepository.save(newComment)
	}
}
