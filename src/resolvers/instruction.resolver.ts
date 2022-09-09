import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FieldEntity } from 'src/entities/field.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { FieldModel } from 'src/models/field.model'
import { InstructionModel } from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import { VariableModelConnection } from 'src/models/variable.model'
import { InstructionService } from 'src/services/instruction.service'
import { transformFieldEntity, transformMethodEntity } from './class.resolver'

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
        const ref = await this.instructionService.findReferenceById(
            instructionModel.id,
        )

        if (ref instanceof MethodEntity) {
            return transformMethodEntity(ref)
        } else if (ref instanceof FieldEntity) {
            return transformFieldEntity(ref)
        }

        return null
    }

    @ResolveField()
    async invokedBy(
        @Parent() instructionModel: InstructionModel,
    ): Promise<MethodModel> {
        const method = await this.instructionService.findInvokedById(
            instructionModel.id,
        )

        return transformMethodEntity(method)
    }

    @ResolveField()
    async enteringVariables(
        @Parent() instructionModel: InstructionModel,
        @Args('first', { nullable: true }) first?: number,
        @Args('after', { nullable: true }) after?: string,
        @Args('last', { nullable: true }) last?: number,
        @Args('before', { nullable: true }) before?: string,
    ): Promise<VariableModelConnection> {
        let reverse = false
        let limit = first || 10
        let token = after || ''

        if (!first && !after) {
            reverse = !!(last || before)
            limit = last || limit
            token = before || token
        }

        const variables =
            await this.instructionService.findEnteringVariablesById(
                instructionModel.id,
                limit + 1,
                token,
                reverse,
            )

        if (variables.length === 0) {
            return null
        }

        const hasNextPage = variables.length > limit

        let validVars = variables
        if (hasNextPage) {
            if (reverse) {
                validVars = variables.slice(1)
            } else {
                validVars = variables.slice(0, -1)
            }
        }

        const edges = validVars.map((v) => ({ node: v, cursor: v.id }))

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
    async exitingVariables(
        @Parent() instructionModel: InstructionModel,
        @Args('first', { nullable: true }) first?: number,
        @Args('after', { nullable: true }) after?: string,
        @Args('last', { nullable: true }) last?: number,
        @Args('before', { nullable: true }) before?: string,
    ): Promise<VariableModelConnection> {
        let reverse = false
        let limit = first || 10
        let token = after || ''

        if (!first && !after) {
            reverse = !!(last || before)
            limit = last || limit
            token = before || token
        }

        const variables =
            await this.instructionService.findExitingVariablesById(
                instructionModel.id,
                limit + 1,
                token,
                reverse,
            )

        if (variables.length === 0) {
            return null
        }

        const hasNextPage = variables.length > limit

        let validVars = variables
        if (hasNextPage) {
            if (reverse) {
                validVars = variables.slice(1)
            } else {
                validVars = variables.slice(0, -1)
            }
        }

        const edges = validVars.map((v) => ({ node: v, cursor: v.id }))

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
