import {
    createUnionType,
    Field,
    Int,
    ObjectType,
    registerEnumType,
} from '@nestjs/graphql'
import { OpCode } from 'src/util/opcodeUtil'
import { Paginated } from 'src/util/paginationUtil'
import { FieldModel } from './field.model'
import { MethodModel } from './method.model'

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
}

@ObjectType()
export class InstructionModelConnection extends Paginated(InstructionModel) {}
