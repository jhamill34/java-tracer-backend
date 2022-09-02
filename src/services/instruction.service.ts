import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InstructionClosureEntity } from 'src/entities/closures/instructionClosure.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InstructionService {
    constructor(
        @InjectRepository(InstructionEntity)
        private instructionRepo: Repository<InstructionEntity>,
        @InjectRepository(InstructionClosureEntity)
        private instructionClosureRepo: Repository<InstructionClosureEntity>,
    ) {}

    async save(instruction: InstructionEntity): Promise<void> {
        await this.instructionRepo.save(instruction)
    }

    async saveEdge(
        from: InstructionEntity,
        to: InstructionEntity,
    ): Promise<void> {
        if (from.jobToken !== to.jobToken) {
            return
        }

        const edge = new InstructionClosureEntity()
        edge.ancestor = from
        edge.child = to
        edge.jobToken = from.jobToken

        await this.instructionClosureRepo.save(edge)
    }
}
