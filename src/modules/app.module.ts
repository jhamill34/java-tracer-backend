import { Module } from '@nestjs/common'
import { FileModule } from './file.module'

@Module({
    imports: [FileModule],
})
export class AppModule {}
