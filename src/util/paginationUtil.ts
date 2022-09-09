import { Type } from '@nestjs/common'
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql'

export interface Edge<T> {
    node: T
    cursor: string
}

export interface Connection<T> {
    edges: Edge<T>[]
    pageInfo: PageInfo
}

@ObjectType()
export class PageInfo {
    @Field(() => Boolean)
    hasNextPage: boolean

    @Field()
    startCursor: string

    @Field()
    endCursor: string

    @Field(() => Boolean)
    forward: boolean
}

export function Paginated<T>(classRef: Type<T>): Type<Connection<T>> {
    @ObjectType(`${classRef.name}Edge`)
    abstract class EdgeType implements Edge<T> {
        @Field(() => classRef)
        node: T

        @Field()
        cursor: string
    }

    @ObjectType({ isAbstract: true })
    abstract class PaginatedType implements Connection<T> {
        @Field(() => [EdgeType])
        edges: EdgeType[]

        @Field(() => PageInfo)
        pageInfo: PageInfo
    }

    return PaginatedType as Type<Connection<T>>
}

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { nullable: true })
    first?: number

    @Field({ nullable: true })
    after?: string

    @Field(() => Int, { nullable: true })
    last: number

    @Field({ nullable: true })
    before: string
}

export function paginate<E, T>(
    entities: E[],
    args: PaginationArgs,
    transform: (entity: E) => [T, string],
): Connection<T> {
    const { first, after, last, before } = args
    let reverse = false
    let limit = first || 10
    let token = after || ''

    if (!first && !after) {
        reverse = !!(last || before)
        limit = last || limit
        token = before || token
    }

    if (entities.length === 0) {
        return null
    }

    let edges = entities
        .map((e) => {
            const [node, cursor] = transform(e)
            return { node, cursor }
        })
        .filter((e) => {
            if (reverse) {
                return e.cursor < token
            } else {
                return e.cursor > token
            }
        })

    const hasNextPage = edges.length > limit
    if (hasNextPage) {
        if (reverse) {
            edges = edges.slice(-limit)
        } else {
            edges = edges.slice(0, limit)
        }
    }

    return {
        edges,
        pageInfo: {
            hasNextPage,
            startCursor: edges.at(0).cursor,
            endCursor: edges.at(-1).cursor,
            forward: !reverse,
        },
    }
}
