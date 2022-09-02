import { ChildEntity } from 'typeorm'
import { AbstractClassEntity } from './abstractClass.entity'

@ChildEntity()
export class UnknownClassEntity extends AbstractClassEntity {}
