import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { TokenDto } from 'src/dto/token.dto'
import { FileService } from 'src/services/file.service'

@Controller()
export class FilesController {
    constructor(private readonly fileService: FileService) {}

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile()
        file: Express.Multer.File,
    ): Promise<TokenDto> {
        return await this.fileService.store(file.buffer)
    }

    @Get('/status/:token')
    async getStatus(@Param('token') token: string) {
        const job = await this.fileService.getStatus({ token })

        if (job === null) {
            throw new NotFoundException()
        }

        return job
    }
}
