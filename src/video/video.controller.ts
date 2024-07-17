import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common'
import { VideoService } from './video.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../user/user.decorator'
import { VideoDto } from './video.dto'

@Controller('video')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@Get('most-popular')
	@HttpCode(200)
	async getMostPopular() {
		return this.videoService.getMostPopular()
	}

	@Get()
	@HttpCode(200)
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.videoService.getAll(searchTerm)
	}

	@Get(':id')
	@HttpCode(200)
	async getVideo(@Param('id') id: string) {
		return this.videoService.getById(+id)
	}

	@Get('get-private/:id')
	@Auth()
	@HttpCode(200)
	async getVideoPrivate(@Param('id') id: string) {
		return this.videoService.getById(+id, true)
	}

	@Post()
	@Auth()
	@HttpCode(200)
	async create(@CurrentUser('id') id: number) {
		return this.videoService.create(id)
	}

	@Put(':id')
	@Auth()
	@HttpCode(200)
	async update(@Param('id') id: string, @Body() dto: VideoDto) {
		return this.videoService.update(+id, dto)
	}

	@Delete(':id')
	@Auth()
	@HttpCode(200)
	async delete(@Param('id') id: string) {
		return this.videoService.delete(+id)
	}

	@Patch('update-likes/:id')
	@Auth()
	@HttpCode(200)
	async updateLikes(
		@Param('id') id: string,
		@CurrentUser('id') userId: number,
	) {
		return this.videoService.updateLikes(userId, +id)
	}

	@Patch('update-views/:id')
	@HttpCode(200)
	async updateViews(@Param('id') id: string) {
		return this.videoService.updateViews(+id)
	}
}
