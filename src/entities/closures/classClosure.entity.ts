import { Column, Entity, Index, ManyToOne, TableInheritance } from 'typeorm'
import { AbstractClassEntity } from '../abstractClass.entity'
import { AbstractRecord } from '../abstractRecord.entity'

@Entity(ClassClosureEntity.MODEL_NAME)
@TableInheritance({ column: { name: 'type', type: 'varchar' } })
export class ClassClosureEntity extends AbstractRecord {
    static MODEL_NAME = 'class_closure_entity'

    @Column()
    @Index()
    ancestorId: string

    @Column()
    @Index()
    childId: string

    @ManyToOne(() => AbstractClassEntity, {
        createForeignKeyConstraints: false,
    })
    ancestor: AbstractClassEntity

    @ManyToOne(() => AbstractClassEntity, {
        createForeignKeyConstraints: false,
    })
    child: AbstractClassEntity
}
