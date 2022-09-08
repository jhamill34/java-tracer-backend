import { Field, ObjectType } from '@nestjs/graphql'
import { ClassModel } from './class.model'
import { InstructionModel } from './instruction.model'
import { VariableModel } from './variable.model'

@ObjectType()
export class MethodModel {
    @Field()
    id: string

    @Field()
    name: string

    @Field()
    descriptor: string

    @Field(() => ClassModel)
    owner?: ClassModel

    @Field({ nullable: true })
    signature?: string

    @Field(() => [String], { nullable: true })
    modifiers?: string[]

    @Field(() => [VariableModel], { nullable: true })
    variables?: VariableModel[]

    @Field(() => [InstructionModel], { nullable: true })
    instructions?: InstructionModel[]
}
