import {
    createUnionType,
    Field,
    Int,
    ObjectType,
    registerEnumType,
} from '@nestjs/graphql'
import { OpCode } from 'src/util/opcodeUtil'
import { FieldModel } from './field.model'
import { MethodModel } from './method.model'
import { PageInfo } from './pageinfo.model'
import { VariableModelConnection } from './variable.model'

registerEnumType(OpCode, {
    name: 'OpCodeEnum',
})

export const ReferenceModel = createUnionType({
    name: 'ReferenceModel',
    types: () => [MethodModel, FieldModel] as const,
    resolveType: (value) => {
        if (value.type === 'method') {
            return MethodModel
        }

        if (value.type === 'field') {
            return FieldModel
        }

        return null
    },
})

@ObjectType()
export class InstructionModel {
    @Field()
    id: string

    @Field(() => OpCode)
    opCode: OpCode

    @Field(() => Int)
    lineNumber: number

    @Field(() => [String])
    stack: string[]

    @Field(() => MethodModel)
    invokedBy?: MethodModel

    @Field(() => ReferenceModel, { nullable: true })
    reference?: MethodModel | FieldModel

    @Field(() => [String], { nullable: true })
    next?: string[]

    @Field(() => [String], { nullable: true })
    previous?: string[]

    @Field(() => VariableModelConnection, { nullable: true })
    enteringVariables?: VariableModelConnection

    @Field(() => VariableModelConnection, { nullable: true })
    exitingVariables?: VariableModelConnection
}

@ObjectType()
export class InstructionModelConnection {
    @Field(() => [InstructionModelEdge])
    edges: InstructionModelEdge[]

    @Field(() => PageInfo)
    pageInfo: PageInfo
}

@ObjectType()
export class InstructionModelEdge {
    @Field(() => InstructionModel)
    node: InstructionModel

    @Field()
    cursor: string
}
