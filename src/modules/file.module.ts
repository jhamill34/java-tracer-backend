import { Module } from '@nestjs/common'
import { FilesController } from 'src/controllers/files.controller'
import { GraphController } from 'src/controllers/graph.controller'
import { ClasspathService } from 'src/services/classpath.service'
import { CompileLogService } from 'src/services/compile.service'
import { FileService } from 'src/services/file.service'
import { GraphService } from 'src/services/graph.service'
import { RuntimeLogService } from 'src/services/runtime.service'

@Module({
    controllers: [FilesController, GraphController],
    providers: [
        FileService,
        CompileLogService,
        RuntimeLogService,
        ClasspathService,
        GraphService,
    ],
})
export class FileModule {}
