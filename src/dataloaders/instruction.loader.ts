import DataLoader from 'dataloader'
import { InstructionClosureEntity } from 'src/entities/closures/instructionClosure.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { ReferenceEntity } from 'src/entities/reference.entity'
import { InstructionService } from 'src/services/instruction.service'

export class InstructionDataLoader {
    readonly enteringVariablesLoader: DataLoader<string, LocalVariableEntity[]>
    readonly exitingVariablesLoader: DataLoader<string, LocalVariableEntity[]>
    readonly referencesLoader: DataLoader<string, ReferenceEntity>
    readonly fromInvokedByLoader: DataLoader<string, InstructionEntity[]>
    readonly instructionsCallingMethodLoader: DataLoader<
        string,
        InstructionEntity[]
    >
    readonly invokedByLoader: DataLoader<string, MethodEntity>
    readonly nextLoader: DataLoader<string, InstructionClosureEntity[]>
    readonly previousLoader: DataLoader<string, InstructionClosureEntity[]>

    constructor(instructionService: InstructionService) {
        this.enteringVariablesLoader = new DataLoader(
            async (keys: string[]) =>
                await instructionService.findEnteringVariablesForInstructionIds(
                    keys,
                ),
        )
        this.exitingVariablesLoader = new DataLoader(
            async (keys: string[]) =>
                await instructionService.findExitingVariablesForInstructionIds(
                    keys,
                ),
        )
        this.referencesLoader = new DataLoader(
            async (keys: string[]) =>
                await instructionService.findReferenceByInstructionIds(keys),
        )
        this.fromInvokedByLoader = new DataLoader(
            async (keys: string[]) =>
                await instructionService.findAllByMethodIds(keys),
        )
        this.invokedByLoader = new DataLoader(
            async (keys: string[]) =>
                await instructionService.findInvokedForInstructionIds(keys),
        )
        this.instructionsCallingMethodLoader = new DataLoader(
            async (keys: string[]) =>
                await instructionService.findAllInstructionsCallingMethods(
                    keys,
                ),
        )
        this.nextLoader = new DataLoader(
            async (keys: string[]) =>
                await instructionService.findNextByInstructionIds(keys),
        )
        this.previousLoader = new DataLoader(
            async (keys: string[]) =>
                await instructionService.findPreviousByInstructionIds(keys),
        )
    }
}
