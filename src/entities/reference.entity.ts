import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    TableInheritance,
} from 'typeorm'
import { AbstractClassEntity } from './abstractClass.entity'
import { AbstractRecord } from './abstractRecord.entity'
import { InstructionEntity } from './instruction.entity'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class ReferenceEntity extends AbstractRecord {
    static MODEL_NAME = 'reference_entity'

    @Column()
    name: string

    @Column()
    descriptor: string

    @Column({ nullable: true })
    signature?: string

    @Column('simple-array')
    modifiers: string[]

    @Column()
    @Index()
    classId: string

    @OneToMany(() => InstructionEntity, (edge) => edge.reference, {
        createForeignKeyConstraints: false,
    })
    invokedBy: InstructionEntity[]

    @ManyToOne(() => AbstractClassEntity, {
        createForeignKeyConstraints: false,
    })
    class: AbstractClassEntity
}
