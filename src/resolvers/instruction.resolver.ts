import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
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
import { InstructionService } from 'src/services/instruction.service'
import { paginate, PaginationArgs } from 'src/util/paginationUtil'
import { transformFieldEntity, transformMethodEntity } from './class.resolver'

@Resolver(() => InstructionModel)
export class InstructionResolver {
    constructor(private readonly instructionService: InstructionService) {}

    @ResolveField()
    async next(
        @Parent() instructionModel: InstructionModel,
    ): Promise<string[]> {
        const edges = await this.instructionService.findNextByInstructionIds([
            instructionModel.id,
        ])

        return edges[0].map((e) => e.childId)
    }

    @ResolveField()
    async previous(
        @Parent() instructionModel: InstructionModel,
    ): Promise<string[]> {
        const edges =
            await this.instructionService.findPreviousByInstructionIds([
                instructionModel.id,
            ])

        return edges[0].map((e) => e.ancestorId)
    }

    @ResolveField()
    async reference(
        @Parent() instructionModel: InstructionModel,
    ): Promise<MethodModel | FieldModel> {
        const refs =
            await this.instructionService.findReferenceByInstructionIds([
                instructionModel.id,
            ])

        const ref = refs[0]
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
    ): Promise<MethodModel> {
        const method =
            await this.instructionService.findInvokedForInstructionIds([
                instructionModel.id,
            ])

        return transformMethodEntity(method[0])[0]
    }

    @ResolveField()
    async enteringVariables(
        @Parent() instructionModel: InstructionModel,
        @Args() args: PaginationArgs,
    ): Promise<VariableModelConnection> {
        const variables =
            await this.instructionService.findEnteringVariablesForInstructionIds(
                [instructionModel.id],
            )

        return paginate(variables[0], args, transformLocalVariableEntity)
    }

    @ResolveField()
    async exitingVariables(
        @Parent() instructionModel: InstructionModel,
        @Args() args: PaginationArgs,
    ): Promise<VariableModelConnection> {
        const variables =
            await this.instructionService.findExitingVariablesForInstructionIds(
                [instructionModel.id],
            )

        return paginate(variables[0], args, transformLocalVariableEntity)
    }
}

export function transformLocalVariableEntity(
    variable: LocalVariableEntity,
): [VariableModel, string] {
    const { id, name, descriptor, signature } = variable

    const node = { id, name, descriptor, signature }

    return [node, id]
}
