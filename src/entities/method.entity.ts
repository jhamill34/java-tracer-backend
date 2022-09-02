import { ChildEntity, Column, OneToMany } from 'typeorm'
import { InstructionEntity } from './instruction.entity'
import { LocalVariableEntity } from './localVariable.entity'
import { ReferenceEntity } from './reference.entity'

@ChildEntity()
export class MethodEntity extends ReferenceEntity {
    @Column('simple-array', { nullable: true })
    parameters?: string[]

    @OneToMany(() => InstructionEntity, (edge) => edge.invokedBy)
    instructions: InstructionEntity[]

    @OneToMany(() => LocalVariableEntity, (variable) => variable.method)
    localVariables: LocalVariableEntity[]
}
