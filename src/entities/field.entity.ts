import { ChildEntity, Column } from 'typeorm'
import { ReferenceEntity } from './reference.entity'

@ChildEntity()
export class FieldEntity extends ReferenceEntity {
    @Column({ nullable: true })
    initialValue?: string
}
