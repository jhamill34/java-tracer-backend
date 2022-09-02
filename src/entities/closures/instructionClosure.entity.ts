import { Entity, ManyToOne } from 'typeorm'
import { AbstractRecord } from '../abstractRecord.entity'
import { InstructionEntity } from '../instruction.entity'

@Entity()
export class InstructionClosureEntity extends AbstractRecord {
    static MODEL_NAME = 'instruction_closure_entity'

    @ManyToOne(() => InstructionEntity, (instr) => instr.ancestors)
    ancestor: InstructionEntity

    @ManyToOne(() => InstructionEntity, (instr) => instr.children)
    child: InstructionEntity
}
