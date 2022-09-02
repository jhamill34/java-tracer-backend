import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from 'typeorm'
import { AbstractRecord } from './abstractRecord.entity'
import { InstructionClosureEntity } from './closures/instructionClosure.entity'
import { LocalVariableEntity } from './localVariable.entity'
import { MethodEntity } from './method.entity'
import { ReferenceEntity } from './reference.entity'

@Entity(InstructionEntity.MODEL_NAME)
export class InstructionEntity extends AbstractRecord {
    static MODEL_NAME = 'instruction_entity'

    @ManyToOne(() => MethodEntity, (method) => method.instructions)
    owner: MethodEntity

    @Column()
    opCode: number

    @Column()
    lineNumber: number

    @ManyToOne(() => ReferenceEntity, (ref) => ref.invokedBy)
    reference?: ReferenceEntity

    @ManyToOne(() => MethodEntity, (method) => method.instructions)
    invokedBy: MethodEntity

    @ManyToMany(() => LocalVariableEntity)
    @JoinTable()
    localVariables: LocalVariableEntity[]

    @Column('simple-array')
    stack: string[]

    @OneToMany(() => InstructionClosureEntity, (closure) => closure.ancestor)
    ancestors: InstructionEntity[]

    @OneToMany(() => InstructionClosureEntity, (closure) => closure.child)
    children: InstructionEntity[]
}
