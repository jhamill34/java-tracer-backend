import { Entity, ManyToOne, TableInheritance } from 'typeorm'
import { AbstractClassEntity } from '../abstractClass.entity'
import { AbstractRecord } from '../abstractRecord.entity'

@Entity(ClassClosureEntity.MODEL_NAME)
@TableInheritance({ column: { name: 'type', type: 'varchar' } })
export class ClassClosureEntity extends AbstractRecord {
    static MODEL_NAME = 'class_closure_entity'

    @ManyToOne(() => AbstractClassEntity)
    ancestor: AbstractClassEntity

    @ManyToOne(() => AbstractClassEntity)
    child: AbstractClassEntity
}
