import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { AbstractRecord } from './abstractRecord.entity'
import { InstructionEntity } from './instruction.entity'
import { MethodEntity } from './method.entity'

@Entity()
@Index(['name'])
export class LocalVariableEntity extends AbstractRecord {
    static MODEL_NAME = 'local_variable_entity'

    @Column()
    name: string

    @Column()
    descriptor: string

    @Column({ nullable: true })
    signature?: string

    @ManyToOne(() => MethodEntity, (method) => method.localVariables, {
        createForeignKeyConstraints: false,
    })
    method: MethodEntity

    @ManyToOne(
        () => InstructionEntity,
        (instruction) => instruction.enteringVariables,
        { createForeignKeyConstraints: false },
    )
    startInstruction: InstructionEntity

    @ManyToOne(
        () => InstructionEntity,
        (instruction) => instruction.exitingVariables,
        { createForeignKeyConstraints: false },
    )
    endInstruction: InstructionEntity
}
