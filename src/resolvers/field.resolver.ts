import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ClassModel } from 'src/models/class.model'
import { FieldModel } from 'src/models/field.model'
import { RequestContext } from 'src/util/context'
import { transformClassEntity } from './class.resolver'

@Resolver(() => FieldModel)
export class FieldResolver {
    @ResolveField()
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
