import { Module } from '@nestjs/common'
import { FilesController } from 'src/controllers/files.controller'
import { UsersController } from 'src/controllers/users.controller'
import { ClassModule } from './class.module'
import { FileModule } from './file.module'
import { UsersModule } from './users.module'

@Module({
    imports: [UsersModule, ClassModule, FileModule],
    controllers: [UsersController, FilesController],
})
export class ControllersModule {}
