import { Injectable } from '@nestjs/common'
import AdmZip from 'adm-zip'
import { ClasspathService } from './classpath.service'
import { CompileLogService } from './compile.service'
import { Parser } from './interfaces'
import { RuntimeLogService } from './runtime.service'

const MANIFEST_FILE = 'manifest.json'

interface Manifest {
    compile: string
    run: string
    classpath: string
}

@Injectable()
export class FileService implements Parser<void> {
    constructor(
        private readonly compileService: CompileLogService,
        private readonly runtimeService: RuntimeLogService,
        private readonly classpathService: ClasspathService,
    ) {}

    extract(buffer: Buffer): void {
        const zip = new AdmZip(buffer)

        const manifest = this.extractManifest(zip)

        this.compileService.extract(zip.getEntry(manifest.compile).getData())
    }

    private extractManifest(zip: AdmZip): Manifest {
        return JSON.parse(zip.getEntry(MANIFEST_FILE).getData().toString())
    }
}
