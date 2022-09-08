import { Field, ObjectType } from '@nestjs/graphql'
import { ClassModel } from './class.model'

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
