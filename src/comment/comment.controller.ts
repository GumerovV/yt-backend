import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { CommentService } from './comment.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../user/user.decorator'
import { CommentDto } from './comment.dto'

@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Post()
	@Auth()
	@HttpCode(200)
	async create(@CurrentUser('id') id: number, @Body() dto: CommentDto) {
		return this.commentService.create(id, dto)
	}
}
