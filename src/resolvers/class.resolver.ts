import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { MethodEntity } from 'src/entities/method.entity'
import { ClassModel } from 'src/models/class.model'
import {
    ClassModelConnection,
    ClassModelEdge,
} from 'src/models/classconnection.model'
import { FieldModelConnection, FieldModelEdge } from 'src/models/field.model'
import {
    MethodModel,
    MethodModelConnection,
    MethodModelEdge,
} from 'src/models/method.model'
import { ClassService } from 'src/services/class.service'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'

@Resolver(() => ClassModel)
export class ClassResolver {
    constructor(
        private readonly classService: ClassService,
        private readonly referenceService: ReferenceEntityService,
    ) {}

    @Query(() => ClassModel)
    async getClass(@Args('name') name: string): Promise<ClassModel> {
        return await this.classService.findByName(name)
    }

    @ResolveField()
    async methods(
        @Parent() klass: ClassModel,
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<MethodModelConnection> {
        const methods = await this.referenceService.findAllMethodsForClass(
            klass.id,
            first + 1,
            after,
        )

        if (methods.length === 0) {
            return null
        }

        const hasNextPage = methods.length > first

        let edges: MethodModelEdge[] = []
        if (hasNextPage) {
            edges = methods
                .slice(0, -1)
                .map((m) => ({ node: transformMethodEntity(m), cursor: m.id }))
        } else {
            edges = methods.map((m) => ({
                node: transformMethodEntity(m),
                cursor: m.id,
            }))
        }

        return {
            edges,
            pageInfo: {
                hasNextPage: methods.length > first,
                startCursor: edges.at(0).cursor,
                endCursor: edges.at(-1).cursor,
            },
        }
    }

    @ResolveField()
    async fields(
        @Parent() klass: ClassModel,
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<FieldModelConnection> {
        const fields = await this.referenceService.findAllFieldsForClass(
            klass.id,
            first + 1,
            after,
        )

        if (fields.length === 0) {
            return null
        }

        const hasNextPage = fields.length > first

        let edges: FieldModelEdge[] = []
        if (hasNextPage) {
            edges = fields.slice(0, -1).map((f) => ({ node: f, cursor: f.id }))
        } else {
            edges = fields.map((f) => ({ node: f, cursor: f.id }))
        }

        return {
            edges,
            pageInfo: {
                hasNextPage,
                startCursor: edges.at(0).cursor,
                endCursor: edges.at(-1).cursor,
            },
        }
    }

    @ResolveField()
    async superClass(@Parent() klass: ClassModel): Promise<ClassModel> {
        return await this.classService.findSuperClass(klass.id)
    }

    @ResolveField()
    async subClasses(
        @Parent() klass: ClassModel,
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<ClassModelConnection> {
        const classes = await this.classService.findSubClass(
            klass.id,
            first,
            after,
        )

        if (classes.length === 0) {
            return null
        }

        const hasNextPage = classes.length > first

        let edges: ClassModelEdge[] = []
        if (hasNextPage) {
            edges = classes.slice(0, -1).map((c) => ({ node: c, cursor: c.id }))
        } else {
            edges = classes.map((c) => ({ node: c, cursor: c.id }))
        }

        return {
            edges,
            pageInfo: {
                hasNextPage,
                startCursor: edges.at(0).cursor,
                endCursor: edges.at(-1).cursor,
            },
        }
    }

    @ResolveField()
    async implementedBy(
        @Parent() klass: ClassModel,
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<ClassModelConnection> {
        const classes = await this.classService.findImplementors(
            klass.id,
            first,
            after,
        )

        if (classes.length === 0) {
            return null
        }

        const hasNextPage = classes.length > first

        let edges: ClassModelEdge[] = []
        if (hasNextPage) {
            edges = classes.slice(0, -1).map((c) => ({ node: c, cursor: c.id }))
        } else {
            edges = classes.map((c) => ({ node: c, cursor: c.id }))
        }

        return {
            edges,
            pageInfo: {
                hasNextPage,
                startCursor: edges.at(0).cursor,
                endCursor: edges.at(-1).cursor,
            },
        }
    }

    @ResolveField()
    async implements(
        @Parent() klass: ClassModel,
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<ClassModelConnection> {
        const classes = await this.classService.findImplemented(
            klass.id,
            first,
            after,
        )

        if (classes.length === 0) {
            return null
        }

        const hasNextPage = classes.length > first

        let edges: ClassModelEdge[] = []
        if (hasNextPage) {
            edges = classes.slice(0, -1).map((c) => ({ node: c, cursor: c.id }))
        } else {
            edges = classes.map((c) => ({ node: c, cursor: c.id }))
        }

        return {
            edges,
            pageInfo: {
                hasNextPage,
                startCursor: edges.at(0).cursor,
                endCursor: edges.at(-1).cursor,
            },
        }
    }
}

function transformMethodEntity(m: MethodEntity): MethodModel {
    const { id, name, descriptor, signature, modifiers } = m
    return {
        id,
        name,
        descriptor,
        signature,
        modifiers,
    }
}
