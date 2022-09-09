import { Field, ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/util/paginationUtil'
import { FieldModelConnection } from './field.model'
import { MethodModelConnection } from './method.model'

type ClassConnection = ReturnType<() => ClassModelConnection>

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
    subClasses?: ClassConnection

    @Field(() => ClassModelConnection, { nullable: true })
    implementedBy?: ClassConnection

    @Field(() => ClassModelConnection, { nullable: true })
    implements?: ClassConnection
}

@ObjectType()
export class ClassModelConnection extends Paginated(ClassModel) {}
