import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobEntity } from 'src/entities/job.entity'
import { FileService } from 'src/services/file.service'
import { ClassModule } from './class.module'

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'uploads',
        }),
        TypeOrmModule.forFeature([JobEntity]),
        ClassModule,
    ],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {}
