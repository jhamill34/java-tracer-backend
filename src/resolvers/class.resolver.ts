import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { MethodEntity } from 'src/entities/method.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { ClassModel, ClassModelConnection } from 'src/models/class.model'
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
import { paginate, PaginationArgs } from 'src/util/paginationUtil'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'

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
        @Args() args: PaginationArgs,
    ): Promise<MethodModelConnection> {
        const methods = await this.referenceService.findAllMethodsForClasses([
            klass.id,
        ])

        return paginate(methods[0], args, transformMethodEntity)
    }

    @ResolveField()
    async fields(
        @Parent() klass: ClassModel,
        @Args() args: PaginationArgs,
    ): Promise<FieldModelConnection> {
        const fields = await this.referenceService.findAllFieldsForClasses([
            klass.id,
        ])

        return paginate(fields[0], args, transformFieldEntity)
    }

    @ResolveField()
    async superClass(@Parent() klass: ClassModel): Promise<ClassModel> {
        const result = await this.classService.findSuperClassForClasses([
            klass.id,
        ])
        return result[0][0]
    }

    @ResolveField()
    async subClasses(
        @Parent() klass: ClassModel,
        @Args() args: PaginationArgs,
    ): Promise<ClassModelConnection> {
        const classes = await this.classService.findSubClassesForClasses([
            klass.id,
        ])

        return paginate(classes[0], args, transformClassEntity)
    }

    @ResolveField()
    async implementedBy(
        @Parent() klass: ClassModel,
        @Args() args: PaginationArgs,
    ): Promise<ClassModelConnection> {
        const classes = await this.classService.findImplementorsForClasses([
            klass.id,
        ])

        return paginate(classes[0], args, transformClassEntity)
    }

    @ResolveField()
    async implements(
        @Parent() klass: ClassModel,
        @Args() args: PaginationArgs,
    ): Promise<ClassModelConnection> {
        const classes = await this.classService.findImplementedForClasses([
            klass.id,
        ])

        return paginate(classes[0], args, transformClassEntity)
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
