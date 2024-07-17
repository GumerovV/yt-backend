import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { AuthDto, AuthResponseDto } from './auth.dto'
import { compare, genSalt, hash } from 'bcryptjs'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly jwtService: JwtService,
	) {}

	async login(dto: AuthDto): Promise<AuthResponseDto> {
		const user = await this.validateUser(dto)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(user.id),
		}
	}

	async register(dto: AuthDto): Promise<AuthResponseDto> {
		const candidate = await this.userRepository.findOne({
			where: { email: dto.email },
		})

		if (candidate)
			throw new BadRequestException('Данный email уже зарегистрирован!')

		const salt = await genSalt(10)

		const createdUser = this.userRepository.create({
			email: dto.email,
			password: await hash(dto.password, salt),
		})

		const user = await this.userRepository.save(createdUser)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(user.id),
		}
	}

	async validateUser(dto: AuthDto) {
		const user = await this.userRepository.findOne({
			where: {
				email: dto.email,
			},
			select: ['id', 'email', 'password'],
		})

		if (!user) throw new NotFoundException('Неверный email или пароль!')

		const isValidPassword = await compare(dto.password, user.password)

		if (!isValidPassword)
			throw new UnauthorizedException('Неверный email или пароль!')

		return user
	}

	async issueAccessToken(userId: number) {
		const data = { id: userId }

		return await this.jwtService.signAsync(data, { expiresIn: '24h' })
	}

	returnUserFields(user: UserEntity) {
		return {
			id: user.id,
			email: user.email,
		}
	}
}
