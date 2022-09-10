import { Field, ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/util/paginationUtil'

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
}

@ObjectType()
export class ClassModelConnection extends Paginated(ClassModel) {}
