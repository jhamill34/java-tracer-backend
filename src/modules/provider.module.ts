import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobEntity } from 'src/entities/job.entity'
import { UploadsProcessor } from 'src/processors/uploads.processor'
import { FileModule } from './file.module'

@Module({
    imports: [TypeOrmModule.forFeature([JobEntity]), FileModule],
    providers: [UploadsProcessor],
})
export class ProviderModule {}
