import { Field, ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/util/paginationUtil'

@ObjectType()
export class FieldModel {
    type = 'field'

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
export class FieldModelConnection extends Paginated(FieldModel) {}
