import { Field, ObjectType } from '@nestjs/graphql'
import { ClassModelConnection } from './classconnection.model'
import { FieldModelConnection } from './field.model'
import { MethodModelConnection } from './method.model'
import { PageInfo } from './pageinfo.model'

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

    @Field(() => MethodModelConnection, { nullable: true })
    methods?: MethodModelConnection

    @Field(() => FieldModelConnection, { nullable: true })
    fields?: FieldModelConnection

    @Field(() => ClassModel, { nullable: true })
    superClass?: ClassModel

    @Field(() => ClassModelConnection, { nullable: true })
    subClasses?: ClassModelConnection

    @Field(() => ClassModelConnection, { nullable: true })
    implementedBy?: ClassModelConnection

    @Field(() => ClassModelConnection, { nullable: true })
    implements?: ClassModelConnection
}
