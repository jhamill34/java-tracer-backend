import { Injectable } from '@nestjs/common'
import AdmZip from 'adm-zip'
import { ClasspathService } from './classpath.service'
import { CompileLogService } from './compile.service'
import { RuntimeLogService } from './runtime.service'

const MANIFEST_FILE = 'manifest.json'

interface Manifest {
    compile: string
    run: string
    classpath: string
}

@Injectable()
export class FileService {
    constructor(
        private readonly compileService: CompileLogService,
        private readonly runtimeService: RuntimeLogService,
        private readonly classpathService: ClasspathService,
    ) {}

    extract(buffer: Buffer): void {
        const zip = new AdmZip(buffer)

        const manifest = this.extractManifest(zip)

        zip.getEntries().forEach((zipEntry) => {
            if (!zipEntry.isDirectory) {
                const entryName = zipEntry.rawEntryName.toString()
                if (entryName === manifest.compile) {
                    this.compileService.extract(zipEntry.getData())
                } else if (entryName === manifest.run) {
                    this.runtimeService.extract(zipEntry.getData())
                } else if (entryName.startsWith(manifest.classpath)) {
                    this.classpathService.extract(
                        zipEntry.name,
                        zipEntry.getData(),
                    )
                }
            }
        })
    }

    private extractManifest(zip: AdmZip): Manifest {
        return JSON.parse(zip.getEntry(MANIFEST_FILE).getData().toString())
    }
}
