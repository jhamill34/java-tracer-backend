import { ChildEntity } from 'typeorm'
import { ClassClosureEntity } from './classClosure.entity'

@ChildEntity()
export class ExtendsEntity extends ClassClosureEntity {}
