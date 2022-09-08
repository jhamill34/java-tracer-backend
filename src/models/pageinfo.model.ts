import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PageInfo {
    @Field(() => Boolean)
    hasNextPage: boolean

    @Field()
    startCursor: string

    @Field()
    endCursor: string
}
