import { Field, ObjectType } from '@nestjs/graphql'
import { ClassModel } from './class.model'
import { PageInfo } from './pageinfo.model'

@ObjectType()
export class ClassModelConnection {
    @Field(() => [ClassModelEdge])
    edges: ClassModelEdge[]

    @Field(() => PageInfo)
    pageInfo: PageInfo
}

@ObjectType()
export class ClassModelEdge {
    @Field(() => ClassModel)
    node: ClassModel

    @Field()
    cursor: string
}
