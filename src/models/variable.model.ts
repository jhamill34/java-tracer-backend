import { Field, ObjectType } from '@nestjs/graphql'
import { PageInfo } from './pageinfo.model'

@ObjectType()
export class VariableModel {
    @Field()
    id: string

    @Field()
    name: string

    @Field()
    descriptor: string

    @Field()
    signature?: string
}

@ObjectType()
export class VariableModelConnection {
    @Field(() => [VariableModelEdge])
    edges: VariableModelEdge[]

    @Field(() => PageInfo)
    pageInfo: PageInfo
}

@ObjectType()
export class VariableModelEdge {
    @Field(() => VariableModel)
    node: VariableModel

    @Field()
    cursor: string
}
