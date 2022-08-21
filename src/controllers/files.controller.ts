import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from 'src/services/file.service'

@Controller()
export class FilesController {
    constructor(private readonly fileService: FileService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(
        @UploadedFile()
        file: Express.Multer.File,
    ): void {
        this.fileService.extract(file.buffer)
    }
}
