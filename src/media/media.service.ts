import { Injectable } from '@nestjs/common'
import { IMediaResponse } from './media.interface'
import * as path from 'path'
import { ensureDir, writeFile } from 'fs-extra'

@Injectable()
export class MediaService {
	async saveMedia(
		mediaFile: Express.Multer.File,
		folder: string = 'default',
	): Promise<IMediaResponse> {
		const uploadFolder = path.join(process.cwd(), `uploads/${folder}`)
		await ensureDir(uploadFolder)

		await writeFile(
			path.join(uploadFolder, mediaFile.originalname),
			mediaFile.buffer,
		)

		return {
			url: `uploads/${folder}/${mediaFile.originalname}`,
			name: mediaFile.originalname,
		}
	}

	async getFile(path: string) {
		return
	}
}
