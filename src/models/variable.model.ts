import { Field, ObjectType } from '@nestjs/graphql'
import { Paginated } from 'src/util/paginationUtil'

@ObjectType()
export class VariableModel {
    @Field()
    id: string

    @Field()
    name: string

    @Field()
    descriptor: string

    @Field()
    signature?: string
}

@ObjectType()
export class VariableModelConnection extends Paginated(VariableModel) {}
