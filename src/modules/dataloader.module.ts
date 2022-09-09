import { Module } from '@nestjs/common'
import { DataLoaderService } from 'src/services/dataloader.service'
import { ClassModule } from './class.module'
import { FieldModule } from './field.module'
import { InstructionModule } from './instruction.module'
import { MethodModule } from './method.module'
import { ReferenceModule } from './reference.module'

@Module({
    imports: [
        ClassModule,
        MethodModule,
        FieldModule,
        InstructionModule,
        ReferenceModule,
    ],
    providers: [DataLoaderService],
    exports: [DataLoaderService],
})
export class DataLoaderModule {}
