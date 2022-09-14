import {
    Args,
    Context,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { ClassModel } from 'src/models/class.model'
import {
    InstructionModel,
    InstructionModelConnection,
} from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import { VariableModelConnection } from 'src/models/variable.model'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'
import { RequestContext } from 'src/util/context'
import { paginate, PaginationArgs } from 'src/util/paginationUtil'
import { transformClassEntity, transformMethodEntity } from './class.resolver'
import { transformLocalVariableEntity } from './instruction.resolver'

@Resolver(() => MethodModel)
export class MethodResolver {
    constructor(private readonly referenceService: ReferenceEntityService) {}

    @Query(() => MethodModel)
    async method(@Args('id') id: string): Promise<MethodModel> {
        const method = await this.referenceService.findMethod(id)

        return transformMethodEntity(method)[0]
    }

    @ResolveField(() => VariableModelConnection)
    async variables(
        @Parent() method: MethodModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<VariableModelConnection> {
        const variable = await ctx.loaders.variableLoaders.forMethodLoader.load(
            method.id,
        )

        return paginate(variable, args, transformLocalVariableEntity)
    }

    @ResolveField(() => InstructionModelConnection)
    async instructions(
        @Parent() method: MethodModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<InstructionModelConnection> {
        const instructions =
            await ctx.loaders.instructionLoaders.fromInvokedByLoader.load(
                method.id,
            )

        return paginate(instructions, args, transformInstructionEntity)
    }

    @ResolveField(() => InstructionModelConnection)
    async invokers(
        @Parent() method: MethodModel,
        @Context() ctx: RequestContext,
        @Args() args: PaginationArgs,
    ): Promise<InstructionModelConnection> {
        const instructions =
            await ctx.loaders.instructionLoaders.instructionsCallingMethodLoader.load(
                method.id,
            )

        return paginate(instructions, args, transformInstructionEntity)
    }

    @ResolveField(() => ClassModel)
    async owner(
        @Parent() method: MethodModel,
        @Context() ctx: RequestContext,
    ): Promise<ClassModel> {
        const owner = await ctx.loaders.referenceLoaders.methodOwnerLoader.load(
            method.id,
        )
        return transformClassEntity(owner)[0]
    }
}

function transformInstructionEntity(
    i: InstructionEntity,
): [InstructionModel, string] {
    const { id, opCode, lineNumber, stack } = i
    const node = {
        id,
        opCode,
        lineNumber,
        stack,
    }

    return [node, id]
}
