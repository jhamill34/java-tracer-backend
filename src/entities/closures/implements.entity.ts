import { ChildEntity } from 'typeorm'
import { ClassClosureEntity } from './classClosure.entity'

@ChildEntity()
export class ImplementsEntity extends ClassClosureEntity {}
