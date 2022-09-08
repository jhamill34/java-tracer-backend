import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ClassModel } from 'src/models/class.model'
import { FieldModel } from 'src/models/field.model'
import { MethodModel } from 'src/models/method.model'
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
        @Args('limit', { defaultValue: 10 }) limit: number,
        @Args('token', { defaultValue: '' }) token: string,
    ): Promise<MethodModel[]> {
        return await this.referenceService.findAllMethodsForClass(
            klass.id,
            limit,
            token,
        )
    }

    @ResolveField()
    async fields(
        @Parent() klass: ClassModel,
        @Args('limit', { defaultValue: 10 }) limit: number,
        @Args('token', { defaultValue: '' }) token: string,
    ): Promise<FieldModel[]> {
        return await this.referenceService.findAllFieldsForClass(
            klass.id,
            limit,
            token,
        )
    }

    @ResolveField()
    async superClass(@Parent() klass: ClassModel): Promise<ClassModel> {
        return await this.classService.findSuperClass(klass.id)
    }

    @ResolveField()
    async subClasses(@Parent() klass: ClassModel): Promise<ClassModel[]> {
        return await this.classService.findSubClass(klass.id)
    }

    @ResolveField()
    async implementedBy(@Parent() klass: ClassModel): Promise<ClassModel[]> {
        return await this.classService.findImplementors(klass.id)
    }

    @ResolveField()
    async implements(@Parent() klass: ClassModel): Promise<ClassModel[]> {
        return await this.classService.findImplemented(klass.id)
    }
}
