import { Column, Entity, Index, ManyToMany, ManyToOne } from 'typeorm'
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

    @ManyToOne(() => MethodEntity, (method) => method.localVariables)
    method: MethodEntity

    @ManyToMany(() => InstructionEntity)
    instructions: InstructionEntity[]
}
