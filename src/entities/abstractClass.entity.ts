import { Column, Entity, Index, TableInheritance } from 'typeorm'
import { AbstractRecord } from './abstractRecord.entity'

@Entity(AbstractClassEntity.MODEL_NAME)
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Index(['name'])
export abstract class AbstractClassEntity extends AbstractRecord {
    static MODEL_NAME = 'class_entity'

    @Column()
    name: string
}
