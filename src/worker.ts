import { NestFactory } from '@nestjs/core'
import { WorkerModule } from './modules/worker.module'

async function bootstrap() {
    const app = await NestFactory.create(WorkerModule)
    app.init()
}
bootstrap()
