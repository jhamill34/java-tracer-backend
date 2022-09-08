import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { InstructionEntity } from 'src/entities/instruction.entity'
import {
    InstructionModel,
    InstructionModelConnection,
    InstructionModelEdge,
} from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import {
    VariableModelConnection,
    VariableModelEdge,
} from 'src/models/variable.model'
import { InstructionService } from 'src/services/instruction.service'
import { LocalVariableService } from 'src/services/localVariable.service'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'

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
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<VariableModelConnection> {
        const variables = await this.variableService.findAllByMethodId(
            method.id,
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
    async instructions(
        @Parent() method: MethodModel,
        @Args('first', { defaultValue: 10 }) first: number,
        @Args('after', { defaultValue: '' }) after: string,
    ): Promise<InstructionModelConnection> {
        const instructions = await this.instructionService.findAllByMethodId(
            method.id,
            first + 1,
            after,
        )

        if (instructions.length === 0) {
            return null
        }

        const hasNextPage = instructions.length > first

        let edges: InstructionModelEdge[] = []
        if (hasNextPage) {
            edges = instructions.slice(0, -1).map((i) => ({
                node: transformInstructionEntity(i),
                cursor: i.id,
            }))
        } else {
            edges = instructions.map((i) => ({
                node: transformInstructionEntity(i),
                cursor: i.id,
            }))
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
    async owner(@Parent() method: MethodModel) {
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
