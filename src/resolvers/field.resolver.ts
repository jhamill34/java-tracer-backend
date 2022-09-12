import {
    Args,
    Context,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import { ClassModel } from 'src/models/class.model'
import { FieldModel } from 'src/models/field.model'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'
import { RequestContext } from 'src/util/context'
import { transformClassEntity, transformFieldEntity } from './class.resolver'

@Resolver(() => FieldModel)
export class FieldResolver {
    constructor(private readonly referenceService: ReferenceEntityService) {}

    @Query(() => FieldModel)
    async field(@Args('id') id: string): Promise<FieldModel> {
        const field = await this.referenceService.findField(id)

        return transformFieldEntity(field)[0]
    }

    @ResolveField(() => ClassModel)
    async owner(
        @Parent() field: FieldModel,
        @Context() ctx: RequestContext,
    ): Promise<ClassModel> {
        const owner = await ctx.loaders.referenceLoaders.fieldOwnerLoader.load(
            field.id,
        )

        return transformClassEntity(owner)[0]
    }
}
