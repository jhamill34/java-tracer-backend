import { Field, ObjectType } from '@nestjs/graphql'

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
