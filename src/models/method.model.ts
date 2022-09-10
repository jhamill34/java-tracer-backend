import { Field, ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/util/paginationUtil'

@ObjectType()
export class MethodModel {
    type = 'method'

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
}

@ObjectType()
export class MethodModelConnection extends Paginated(MethodModel) {}
