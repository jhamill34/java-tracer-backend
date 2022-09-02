import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import AdmZip from 'adm-zip'
import { Queue } from 'bull'
import { readFile, writeFile } from 'fs'
import path from 'path'
import { TokenDto } from 'src/dto/token.dto'
import { JobEntity } from 'src/entities/job.entity'
import { Repository } from 'typeorm'
import { CompileService } from './compile.service'

const MANIFEST_FILE = 'manifest.json'
const LOCAL_BUCKET = 'bucket'

interface Manifest {
    compile: string
    run: string
    classpath: string
}

function rand(): string {
    return Math.random().toString(36).substring(2)
}

function token(): string {
    return rand() + rand()
}

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(JobEntity)
        private jobRepository: Repository<JobEntity>,
        @InjectQueue('uploads') private uploadQueue: Queue,
        private readonly compileService: CompileService,
    ) {}

    private async saveFile(buffer: Buffer): Promise<TokenDto> {
        const id = token()
        return new Promise<TokenDto>((resolve, reject) => {
            writeFile(path.join(LOCAL_BUCKET, id), buffer, (err) => {
                if (err !== undefined && err !== null) {
                    reject()
                } else {
                    resolve({ token: id })
                }
            })
        })
    }

    private async retrieveFile({ token }: TokenDto): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            readFile(path.join(LOCAL_BUCKET, token), (err, data) => {
                if (err !== undefined && err !== null) {
                    reject()
                } else {
                    resolve(data)
                }
            })
        })
    }

    async store(buffer: Buffer): Promise<TokenDto> {
        const result = await this.saveFile(buffer)

        const job = new JobEntity()
        job.token = result.token
        job.status = 'WAITING'
        job.requested = Date.now()

        await this.jobRepository.save(job)

        await this.uploadQueue.add({ token: result.token }, { delay: 3000 }) // Delay for debugging only...

        return result
    }

    async retrieve(token: TokenDto): Promise<Buffer> {
        return this.retrieveFile(token)
    }

    async getStatus(token: TokenDto): Promise<JobEntity> {
        return this.jobRepository.findOneBy(token)
    }

    async extract(buffer: Buffer, token: TokenDto): Promise<void> {
        const zip = new AdmZip(buffer)

        const manifest = this.extractManifest(zip)

        for (const zipEntry of zip.getEntries()) {
            if (!zipEntry.isDirectory) {
                const entryName = zipEntry.rawEntryName.toString()
                if (entryName === manifest.compile) {
                    await this.compileService.extract(zipEntry.getData(), token)
                }
            }
        }
    }

    private extractManifest(zip: AdmZip): Manifest {
        return JSON.parse(zip.getEntry(MANIFEST_FILE).getData().toString())
    }
}
