import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ClassModel } from './class.model'
import { InstructionModelConnection } from './instruction.model'
import { PageInfo } from './pageinfo.model'
import { VariableModelConnection } from './variable.model'

@ObjectType()
export class MethodModel {
    type = 'method'

    @Field(() => ID)
    id: string

    @Field()
    name: string

    @Field()
    descriptor: string

    @Field(() => ClassModel, { nullable: true })
    owner?: ClassModel

    @Field({ nullable: true })
    signature?: string

    @Field(() => [String], { nullable: true })
    modifiers?: string[]

    @Field(() => VariableModelConnection, { nullable: true })
    variables?: VariableModelConnection

    @Field(() => InstructionModelConnection, { nullable: true })
    instructions?: InstructionModelConnection
}

@ObjectType()
export class MethodModelConnection {
    @Field(() => [MethodModelEdge])
    edges: MethodModelEdge[]

    @Field(() => PageInfo)
    pageInfo: PageInfo
}

@ObjectType()
export class MethodModelEdge {
    @Field(() => MethodModel)
    node: MethodModel

    @Field()
    cursor: string
}
