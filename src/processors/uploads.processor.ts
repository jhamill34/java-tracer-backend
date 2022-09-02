import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from 'bull'
import { TokenDto } from 'src/dto/token.dto'
import { JobEntity } from 'src/entities/job.entity'
import { FileService } from 'src/services/file.service'
import { Repository } from 'typeorm'

@Processor('uploads')
export class UploadsProcessor {
    private readonly logger = new Logger('UploadsProcessor')
    constructor(
        @InjectRepository(JobEntity)
        private jobRepository: Repository<JobEntity>,
        private readonly fileService: FileService,
    ) {}

    @Process()
    async process(job: Job<TokenDto>) {
        this.logger.log(JSON.stringify(job.data))
        const found = await this.jobRepository.findOneBy({
            token: job.data.token,
        })
        found.status = 'started'
        found.started = Date.now()
        await this.jobRepository.save(found)

        try {
            const buffer = await this.fileService.retrieve(job.data)
            await this.fileService.extract(buffer, job.data)

            found.status = 'completed'
            found.completed = Date.now()
            await this.jobRepository.save(found)
        } catch (e) {
            found.status = 'failed'
            found.error = e.toString()
            await this.jobRepository.save(found)
        }
    }
}
