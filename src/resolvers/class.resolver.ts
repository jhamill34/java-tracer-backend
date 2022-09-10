import {
    Args,
    CONTEXT,
    Context,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import { MethodEntity } from 'src/entities/method.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { ClassModel, ClassModelConnection } from 'src/models/class.model'
import { FieldModel, FieldModelConnection } from 'src/models/field.model'
import { MethodModel, MethodModelConnection } from 'src/models/method.model'
import { ClassService } from 'src/services/class.service'
import {
    translateClassAccess,
    translateFieldAccess,
    translateMethodAccess,
} from 'src/util/accessMaskUtil'
import { FieldEntity } from 'src/entities/field.entity'
import { paginate, PaginationArgs } from 'src/util/paginationUtil'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { RequestContext } from 'src/util/context'

@Resolver(() => ClassModel)
export class ClassResolver {
    constructor(private readonly classService: ClassService) {}

    // TODO: Top level search for classes

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

    @ResolveField(() => MethodModelConnection)
    async methods(
        @Parent() klass: ClassModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<MethodModelConnection> {
        const method =
            await ctx.loaders.referenceLoaders.classMethodsLoader.load(klass.id)

        return paginate(method, args, transformMethodEntity)
    }

    @ResolveField(() => FieldModelConnection)
    async fields(
        @Parent() klass: ClassModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<FieldModelConnection> {
        const field = await ctx.loaders.referenceLoaders.classFieldsLoader.load(
            klass.id,
        )

        return paginate(field, args, transformFieldEntity)
    }

    @ResolveField(() => ClassModel)
    async superClass(
        @Parent() klass: ClassModel,
        @Context() ctx: RequestContext,
    ): Promise<ClassModel> {
        const result = await ctx.loaders.classLoaders.superClassLoader.load(
            klass.id,
        )

        return transformClassEntity(result[0])[0]
    }

    @ResolveField(() => ClassModelConnection)
    async subClasses(
        @Parent() klass: ClassModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<ClassModelConnection> {
        const result = await ctx.loaders.classLoaders.subClassLoader.load(
            klass.id,
        )

        return paginate(result, args, transformClassEntity)
    }

    @ResolveField(() => ClassModelConnection)
    async implementedBy(
        @Parent() klass: ClassModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<ClassModelConnection> {
        const result = await ctx.loaders.classLoaders.implementorLoader.load(
            klass.id,
        )

        return paginate(result, args, transformClassEntity)
    }

    @ResolveField(() => ClassModelConnection)
    async implements(
        @Parent() klass: ClassModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<ClassModelConnection> {
        const result = await ctx.loaders.classLoaders.implementedLoader.load(
            klass.id,
        )

        return paginate(result, args, transformClassEntity)
    }
}

export function transformMethodEntity(m: MethodEntity): [MethodModel, string] {
    const { id, name, descriptor, signature, modifiers: methodModifiers } = m

    const modifiers = translateMethodAccess(methodModifiers)

    const node = {
        type: 'method',
        id,
        name,
        descriptor,
        signature,
        modifiers,
    }

    return [node, id]
}

export function transformFieldEntity(f: FieldEntity): [FieldModel, string] {
    const { id, name, descriptor, signature, modifiers: fieldModifiers } = f

    const modifiers = translateFieldAccess(fieldModifiers)

    const node = {
        type: 'field',
        id,
        name,
        descriptor,
        signature,
        modifiers,
    }

    return [node, id]
}

export function transformClassEntity(
    c: AbstractClassEntity,
): [ClassModel, string] {
    if (c instanceof KnownClassEntity) {
        return transformKnownClassEntity(c)
    } else if (c instanceof UnknownClassEntity) {
        return transformUnknownClassEntity(c)
    }

    return [null, '']
}

export function transformKnownClassEntity(
    c: KnownClassEntity,
): [ClassModel, string] {
    const {
        id,
        name,
        hash,
        packageName,
        signature,
        modifiers: classModifiers,
    } = c

    const modifiers = translateClassAccess(classModifiers)

    const node = { id, name, hash, packageName, signature, modifiers }

    return [node, id]
}

export function transformUnknownClassEntity(
    c: UnknownClassEntity,
): [ClassModel, string] {
    const { id } = c

    return [c, id]
}
