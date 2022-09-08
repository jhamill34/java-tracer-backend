import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'
import { AbstractRecord } from './abstractRecord.entity'
import { InstructionClosureEntity } from './closures/instructionClosure.entity'
import { LocalVariableEntity } from './localVariable.entity'
import { MethodEntity } from './method.entity'
import { ReferenceEntity } from './reference.entity'

@Entity(InstructionEntity.MODEL_NAME)
export class InstructionEntity extends AbstractRecord {
    static MODEL_NAME = 'instruction_entity'

    @Column()
    opCode: number

    @Column()
    lineNumber: number

    @Column({ nullable: true })
    @Index()
    referenceId?: string

    @Column({ nullable: true })
    @Index()
    invokedById?: string

    @ManyToOne(() => ReferenceEntity, (ref) => ref.invokedBy, {
        createForeignKeyConstraints: false,
    })
    reference?: ReferenceEntity

    @ManyToOne(() => MethodEntity, (method) => method.instructions, {
        createForeignKeyConstraints: false,
    })
    invokedBy: MethodEntity

    @Column('simple-array')
    stack: string[]

    @OneToMany(() => InstructionClosureEntity, (closure) => closure.ancestor, {
        createForeignKeyConstraints: false,
    })
    ancestors: InstructionEntity[]

    @OneToMany(() => InstructionClosureEntity, (closure) => closure.child, {
        createForeignKeyConstraints: false,
    })
    children: InstructionEntity[]

    @OneToMany(
        () => LocalVariableEntity,
        (variable) => variable.startInstruction,
        { createForeignKeyConstraints: false },
    )
    enteringVariables: LocalVariableEntity[]

    @OneToMany(
        () => LocalVariableEntity,
        (variable) => variable.endInstruction,
        { createForeignKeyConstraints: false },
    )
    exitingVariables: LocalVariableEntity[]
}
