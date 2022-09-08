import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { AbstractRecord } from '../abstractRecord.entity'
import { InstructionEntity } from '../instruction.entity'

@Entity()
export class InstructionClosureEntity extends AbstractRecord {
    static MODEL_NAME = 'instruction_closure_entity'

    @Column()
    @Index()
    ancestorId: string

    @Column()
    @Index()
    childId: string

    @ManyToOne(() => InstructionEntity, (instr) => instr.ancestors, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn()
    ancestor: InstructionEntity

    @ManyToOne(() => InstructionEntity, (instr) => instr.children, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn()
    child: InstructionEntity
}
