import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InstructionClosureEntity } from 'src/entities/closures/instructionClosure.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { InstructionResolver } from 'src/resolvers/instruction.resolver'
import { InstructionService } from 'src/services/instruction.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([InstructionEntity, InstructionClosureEntity]),
    ],
    providers: [InstructionService, InstructionResolver],
    exports: [InstructionService],
})
export class InstructionModule {}
