import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FieldModel } from 'src/models/field.model'
import { InstructionModel } from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import { VariableModel } from 'src/models/variable.model'
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
    ): Promise<VariableModel[]> {
        return await this.instructionService.findEnteringVariablesById(
            instructionModel.id,
        )
    }

    @ResolveField()
    async exitingVariables(
        @Parent() instructionModel: InstructionModel,
    ): Promise<VariableModel[]> {
        return await this.instructionService.findExitingVariablesById(
            instructionModel.id,
        )
    }
}
