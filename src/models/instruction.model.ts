import {
    createUnionType,
    Field,
    Int,
    ObjectType,
    registerEnumType,
} from '@nestjs/graphql'
import { FieldEntity } from 'src/entities/field.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { OpCode } from 'src/util/opcodeUtil'
import { FieldModel } from './field.model'
import { MethodModel } from './method.model'
import { VariableModel } from './variable.model'

registerEnumType(OpCode, {
    name: 'OpCodeEnum',
})

export const ReferenceModel = createUnionType({
    name: 'ReferenceModel',
    types: () => [MethodModel, FieldModel] as const,
    resolveType: (value) => {
        if (value instanceof MethodEntity) {
            return MethodModel
        }

        if (value instanceof FieldEntity) {
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

    @Field(() => [VariableModel], { nullable: true })
    enteringVariables?: VariableModel[]
    
    @Field(() => [VariableModel], { nullable: true })
    exitingVariables?: VariableModel[]
}
