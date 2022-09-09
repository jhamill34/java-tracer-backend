import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { ClassModel } from 'src/models/class.model'
import {
    InstructionModel,
    InstructionModelConnection,
} from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import { VariableModelConnection } from 'src/models/variable.model'
import { InstructionService } from 'src/services/instruction.service'
import { LocalVariableService } from 'src/services/localVariable.service'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'
import { OpCode } from 'src/util/opcodeUtil'

@Resolver(() => MethodModel)
export class MethodResolver {
    constructor(
        private readonly variableService: LocalVariableService,
        private readonly instructionService: InstructionService,
        private readonly referenceService: ReferenceEntityService,
    ) {}

    @ResolveField()
    async variables(
        @Parent() method: MethodModel,
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

        const variables = await this.variableService.findAllByMethodId(
            method.id,
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
    async instructions(
        @Parent() method: MethodModel,
        @Args('first', { nullable: true }) first?: number,
        @Args('after', { nullable: true }) after?: string,
        @Args('last', { nullable: true }) last?: number,
        @Args('before', { nullable: true }) before?: string,
        @Args('opCodes', { defaultValue: [], type: () => [OpCode] })
        opCodes?: OpCode[],
    ): Promise<InstructionModelConnection> {
        let reverse = false
        let limit = first || 10
        let token = after || ''

        if (!first && !after) {
            reverse = !!(last || before)
            limit = last || limit
            token = before || token
        }

        const instructions = await this.instructionService.findAllByMethodId(
            method.id,
            limit + 1,
            token,
            opCodes,
            reverse,
        )

        if (instructions.length === 0) {
            return null
        }

        const hasNextPage = instructions.length > limit

        let validInstructions = instructions
        if (hasNextPage) {
            if (reverse) {
                validInstructions = instructions.slice(1)
            } else {
                validInstructions = instructions.slice(0, -1)
            }
        }

        const edges = validInstructions.map((i) => ({
            node: transformInstructionEntity(i),
            cursor: i.id,
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
    async owner(@Parent() method: MethodModel): Promise<ClassModel> {
        return await this.referenceService.findOwnerForMethodId(method.id)
    }
}

function transformInstructionEntity(i: InstructionEntity): InstructionModel {
    const { id, opCode, lineNumber, stack } = i
    return {
        id,
        opCode,
        lineNumber,
        stack,
    }
}
