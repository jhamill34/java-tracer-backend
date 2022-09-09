import { Args, Context, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FieldEntity } from 'src/entities/field.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { FieldModel } from 'src/models/field.model'
import { InstructionModel } from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import {
    VariableModel,
    VariableModelConnection,
} from 'src/models/variable.model'
import { RequestContext } from 'src/util/context'
import { paginate, PaginationArgs } from 'src/util/paginationUtil'
import { transformFieldEntity, transformMethodEntity } from './class.resolver'

@Resolver(() => InstructionModel)
export class InstructionResolver {
    @ResolveField()
    async next(
        @Parent() instructionModel: InstructionModel,
        @Context() ctx: RequestContext,
    ): Promise<string[]> {
        const edge = await ctx.loaders.instructionLoaders.nextLoader.load(
            instructionModel.id,
        )

        return edge.map((e) => e.childId)
    }

    @ResolveField()
    async previous(
        @Parent() instructionModel: InstructionModel,
        @Context() ctx: RequestContext,
    ): Promise<string[]> {
        const edge = await ctx.loaders.instructionLoaders.previousLoader.load(
            instructionModel.id,
        )

        return edge.map((e) => e.ancestorId)
    }

    @ResolveField()
    async reference(
        @Parent() instructionModel: InstructionModel,
        @Context() ctx: RequestContext,
    ): Promise<MethodModel | FieldModel> {
        const ref = await ctx.loaders.instructionLoaders.referencesLoader.load(
            instructionModel.id,
        )

        if (ref instanceof MethodEntity) {
            return transformMethodEntity(ref)[0]
        } else if (ref instanceof FieldEntity) {
            return transformFieldEntity(ref)[0]
        }

        return null
    }

    @ResolveField()
    async invokedBy(
        @Parent() instructionModel: InstructionModel,
        @Context() ctx: RequestContext,
    ): Promise<MethodModel> {
        const method =
            await ctx.loaders.instructionLoaders.invokedByLoader.load(
                instructionModel.id,
            )

        return transformMethodEntity(method)[0]
    }

    @ResolveField()
    async enteringVariables(
        @Parent() instructionModel: InstructionModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<VariableModelConnection> {
        const variable =
            await ctx.loaders.instructionLoaders.enteringVariablesLoader.load(
                instructionModel.id,
            )

        return paginate(variable, args, transformLocalVariableEntity)
    }

    @ResolveField()
    async exitingVariables(
        @Parent() instructionModel: InstructionModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<VariableModelConnection> {
        const variable =
            await ctx.loaders.instructionLoaders.exitingVariablesLoader.load(
                instructionModel.id,
            )

        return paginate(variable, args, transformLocalVariableEntity)
    }
}

export function transformLocalVariableEntity(
    variable: LocalVariableEntity,
): [VariableModel, string] {
    const { id, name, descriptor, signature } = variable

    const node = { id, name, descriptor, signature }

    return [node, id]
}
