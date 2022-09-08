import { Field, ObjectType } from '@nestjs/graphql'
import { FieldModel } from './field.model'
import { MethodModel } from './method.model'

@ObjectType()
export class ClassModel {
    @Field()
    id: string

    @Field()
    name: string

    @Field({ nullable: true })
    hash?: string

    @Field({ nullable: true })
    packageName?: string

    @Field({ nullable: true })
    signature?: string

    @Field(() => [String], { nullable: true })
    modifiers?: string[]

    @Field(() => [MethodModel], { nullable: true })
    methods?: MethodModel[]

    @Field(() => [FieldModel], { nullable: true })
    fields?: FieldModel[]

    @Field(() => ClassModel, { nullable: true })
    superClass?: ClassModel

    @Field(() => [ClassModel], { nullable: true })
    subClasses?: ClassModel[]

    @Field(() => [ClassModel], { nullable: true })
    implementedBy?: ClassModel[]

    @Field(() => [ClassModel], { nullable: true })
    implements?: ClassModel[]
}
