import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from './user.decorator'
import { UserDto } from './user.dto'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	@HttpCode(200)
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.getProfile(id)
	}

	@Get(':id')
	@HttpCode(200)
	async getUser(@Param('id') id: string) {
		return this.userService.getById(+id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@Auth()
	@HttpCode(200)
	async updateProfile(@Param('id') id: string, @Body() dto: UserDto) {
		return this.userService.update(+id, dto)
	}

	@Patch('subscribe/:UserId')
	@Auth()
	@HttpCode(200)
	async subscribe(
		@Param('UserId') toUserId: string,
		@CurrentUser('id') id: number,
	) {
		return this.userService.subscribe(id, +toUserId)
	}

	@Get()
	@HttpCode(200)
	async getUsers() {
		return this.userService.getAll()
	}
}
