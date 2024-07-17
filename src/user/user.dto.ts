import {
	IsBoolean,
	IsEmail,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class UserDto {
	@IsEmail()
	@IsOptional()
	email?: string

	@MinLength(6, {
		message: 'Пароль должен быть не менее 6 символов!',
	})
	@IsString()
	@IsOptional()
	password?: string

	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	@IsOptional()
	description?: string

	@IsString()
	@IsOptional()
	avatarPath?: string

	@IsBoolean()
	@IsOptional()
	isVerified?: boolean
}
