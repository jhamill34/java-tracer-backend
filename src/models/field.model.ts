import { Field, ObjectType } from '@nestjs/graphql'
import { ClassModel } from './class.model'
import { PageInfo } from './pageinfo.model'

@ObjectType()
export class FieldModel {
    @Field()
    id: string

    @Field()
    name: string

    @Field()
    descriptor: string

    @Field({ nullable: true })
    signature?: string

    @Field(() => [String], { nullable: true })
    modifiers?: string[]

    @Field(() => ClassModel)
    owner?: ClassModel
}

@ObjectType()
export class FieldModelConnection {
    @Field(() => [FieldModelEdge])
    edges: FieldModelEdge[]

    @Field(() => PageInfo)
    pageInfo: PageInfo
}

@ObjectType()
export class FieldModelEdge {
    @Field(() => FieldModel)
    node: FieldModel

    @Field()
    cursor: string
}
