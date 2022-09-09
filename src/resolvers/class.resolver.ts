import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { MethodEntity } from 'src/entities/method.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { ClassModel } from 'src/models/class.model'
import { ClassModelConnection } from 'src/models/classconnection.model'
import { FieldModel, FieldModelConnection } from 'src/models/field.model'
import { MethodModel, MethodModelConnection } from 'src/models/method.model'
import { ClassService } from 'src/services/class.service'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'
import {
    translateClassAccess,
    translateFieldAccess,
    translateMethodAccess,
} from 'src/util/accessMaskUtil'
import { FieldEntity } from 'src/entities/field.entity'

@Resolver(() => ClassModel)
export class ClassResolver {
    constructor(
        private readonly classService: ClassService,
        private readonly referenceService: ReferenceEntityService,
    ) {}

    @Query(() => ClassModel)
    async getClass(@Args('name') name: string): Promise<ClassModel> {
        const klass = await this.classService.findByName(name)

        const model: ClassModel = { ...klass }
        if (klass instanceof KnownClassEntity) {
            model.modifiers = translateClassAccess(klass.modifiers)
        } else {
            model.modifiers = []
        }

        return model
    }

    @ResolveField()
    async methods(
        @Parent() klass: ClassModel,
        @Args('first', { nullable: true }) first?: number,
        @Args('after', { nullable: true }) after?: string,
        @Args('last', { nullable: true }) last?: number,
        @Args('before', { nullable: true }) before?: string,
    ): Promise<MethodModelConnection> {
        let reverse = false
        let limit = first || 10
        let token = after || ''

        if (!first && !after) {
            reverse = !!(last || before)
            limit = last || limit
            token = before || token
        }

        const methods = await this.referenceService.findAllMethodsForClass(
            klass.id,
            limit + 1,
            token,
            reverse,
        )

        if (methods.length === 0) {
            return null
        }

        const hasNextPage = methods.length > limit

        let validEntries = methods
        if (hasNextPage) {
            if (reverse) {
                validEntries = methods.slice(1)
            } else {
                validEntries = methods.slice(0, -1)
            }
        }

        const edges = validEntries.map((m) => ({
            node: transformMethodEntity(m),
            cursor: m.id,
        }))

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

    @ResolveField()
    async fields(
        @Parent() klass: ClassModel,
        @Args('first', { nullable: true }) first?: number,
        @Args('after', { nullable: true }) after?: string,
        @Args('last', { nullable: true }) last?: number,
        @Args('before', { nullable: true }) before?: string,
    ): Promise<FieldModelConnection> {
        let reverse = false
        let limit = first || 10
        let token = after || ''

        if (!first && !after) {
            reverse = !!(last || before)
            limit = last || limit
            token = before || token
        }

        const fields = await this.referenceService.findAllFieldsForClass(
            klass.id,
            limit + 1,
            token,
            reverse,
        )

        if (fields.length === 0) {
            return null
        }

        const hasNextPage = fields.length > limit

        let validFields = fields
        if (hasNextPage) {
            if (reverse) {
                validFields = fields.slice(1)
            } else {
                validFields = fields.slice(0, -1)
            }
        }

        const edges = validFields.map((f) => ({
            node: transformFieldEntity(f),
            cursor: f.id,
        }))

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

    @ResolveField()
    async superClass(@Parent() klass: ClassModel): Promise<ClassModel> {
        return await this.classService.findSuperClass(klass.id)
    }

    @ResolveField()
    async subClasses(
        @Parent() klass: ClassModel,
        @Args('first', { nullable: true }) first?: number,
        @Args('after', { nullable: true }) after?: string,
        @Args('last', { nullable: true }) last?: number,
        @Args('before', { nullable: true }) before?: string,
    ): Promise<ClassModelConnection> {
        let reverse = false
        let limit = first || 10
        let token = after || ''

        if (!first && !after) {
            reverse = !!(last || before)
            limit = last || limit
            token = before || token
        }

        const classes = await this.classService.findSubClass(
            klass.id,
            limit + 1,
            token,
            reverse,
        )

        if (classes.length === 0) {
            return null
        }

        const hasNextPage = classes.length > limit

        let validClasses = classes
        if (hasNextPage) {
            if (reverse) {
                validClasses = classes.slice(1)
            } else {
                validClasses = classes.slice(0, -1)
            }
        }

        const edges = validClasses.map((c) => ({ node: c, cursor: c.id }))

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

    @ResolveField()
    async implementedBy(
        @Parent() klass: ClassModel,
        @Args('first', { nullable: true }) first?: number,
        @Args('after', { nullable: true }) after?: string,
        @Args('last', { nullable: true }) last?: number,
        @Args('before', { nullable: true }) before?: string,
    ): Promise<ClassModelConnection> {
        let reverse = false
        let limit = first || 10
        let token = after || ''

        if (!first && !after) {
            reverse = !!(last || before)
            limit = last || limit
            token = before || token
        }

        const classes = await this.classService.findImplementors(
            klass.id,
            limit + 1,
            token,
            reverse,
        )

        if (classes.length === 0) {
            return null
        }

        const hasNextPage = classes.length > last

        let validClasses = classes
        if (hasNextPage) {
            if (reverse) {
                validClasses = classes.slice(1)
            } else {
                validClasses = classes.slice(0, -1)
            }
        }

        const edges = validClasses.map((c) => ({ node: c, cursor: c.id }))

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

    @ResolveField()
    async implements(
        @Parent() klass: ClassModel,
        @Args('first', { nullable: true }) first?: number,
        @Args('after', { nullable: true }) after?: string,
        @Args('last', { nullable: true }) last?: number,
        @Args('before', { nullable: true }) before?: string,
    ): Promise<ClassModelConnection> {
        let reverse = false
        let limit = first || 10
        let token = after || ''

        if (!first && !after) {
            reverse = !!(last || before)
            limit = last || limit
            token = before || token
        }

        const classes = await this.classService.findImplemented(
            klass.id,
            limit + 1,
            token,
            reverse,
        )

        if (classes.length === 0) {
            return null
        }

        const hasNextPage = classes.length > limit

        let validClasses = classes
        if (hasNextPage) {
            if (reverse) {
                validClasses = classes.slice(1)
            } else {
                validClasses = classes.slice(0, -1)
            }
        }

        const edges = validClasses.map((c) => ({ node: c, cursor: c.id }))

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
}

export function transformMethodEntity(m: MethodEntity): MethodModel {
    const { id, name, descriptor, signature, modifiers: methodModifiers } = m

    const modifiers = translateMethodAccess(methodModifiers)

    return {
        type: 'method',
        id,
        name,
        descriptor,
        signature,
        modifiers,
    }
}

export function transformFieldEntity(f: FieldEntity): FieldModel {
    const { id, name, descriptor, signature, modifiers: fieldModifiers } = f

    const modifiers = translateFieldAccess(fieldModifiers)

    return {
        type: 'field',
        id,
        name,
        descriptor,
        signature,
        modifiers,
    }
}
