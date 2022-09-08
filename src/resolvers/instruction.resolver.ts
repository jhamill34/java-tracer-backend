import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FieldModel } from 'src/models/field.model'
import { InstructionModel } from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import {
    VariableModelConnection,
    VariableModelEdge,
} from 'src/models/variable.model'
import { InstructionService } from 'src/services/instruction.service'

@Resolver(() => InstructionModel)
export class InstructionResolver {
    constructor(private readonly instructionService: InstructionService) {}

    @ResolveField()
    async next(
        @Parent() instructionModel: InstructionModel,
    ): Promise<string[]> {
        return await this.instructionService.findNextById(instructionModel.id)
    }

    @ResolveField()
    async previous(
        @Parent() instructionModel: InstructionModel,
    ): Promise<string[]> {
        return await this.instructionService.findPreviousById(
            instructionModel.id,
        )
    }

    @ResolveField()
    async reference(
        @Parent() instructionModel: InstructionModel,
    ): Promise<MethodModel | FieldModel> {
        return await this.instructionService.findReferenceById(
            instructionModel.id,
        )
    }

    @ResolveField()
    async invokedBy(
        @Parent() instructionModel: InstructionModel,
    ): Promise<MethodModel> {
        return await this.instructionService.findInvokedById(
            instructionModel.id,
        )
    }

    @ResolveField()
    async enteringVariables(
        @Parent() instructionModel: InstructionModel,
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<VariableModelConnection> {
        const variables =
            await this.instructionService.findEnteringVariablesById(
                instructionModel.id,
                first + 1,
                after,
            )

        if (variables.length === 0) {
            return null
        }

        const hasNextPage = variables.length > first

        let edges: VariableModelEdge[] = []
        if (hasNextPage) {
            edges = variables
                .slice(0, -1)
                .map((v) => ({ node: v, cursor: v.id }))
        } else {
            edges = variables.map((v) => ({ node: v, cursor: v.id }))
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
    async exitingVariables(
        @Parent() instructionModel: InstructionModel,
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<VariableModelConnection> {
        const variables =
            await this.instructionService.findExitingVariablesById(
                instructionModel.id,
                first + 1,
                after,
            )

        if (variables.length === 0) {
            return null
        }

        const hasNextPage = variables.length > first

        let edges: VariableModelEdge[] = []
        if (hasNextPage) {
            edges = variables
                .slice(0, -1)
                .map((v) => ({ node: v, cursor: v.id }))
        } else {
            edges = variables.map((v) => ({ node: v, cursor: v.id }))
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
