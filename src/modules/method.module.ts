import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MethodResolver } from 'src/resolvers/method.resolver'
import { LocalVariableService } from 'src/services/localVariable.service'
import { InstructionModule } from './instruction.module'
import { ReferenceModule } from './reference.module'

@Module({
    imports: [
        ReferenceModule,
        InstructionModule,
        TypeOrmModule.forFeature([LocalVariableEntity, InstructionEntity]),
    ],
    providers: [LocalVariableService, MethodResolver],
    exports: [LocalVariableService],
})
export class MethodModule {}
