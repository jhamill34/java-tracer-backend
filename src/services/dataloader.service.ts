import { Injectable } from '@nestjs/common'
import { ClassDataLoader } from 'src/dataloaders/class.loader'
import { InstructionDataLoader } from 'src/dataloaders/instruction.loader'
import { LocalVariableDataLoader } from 'src/dataloaders/localVariable.loader'
import { ReferenceLoader } from 'src/dataloaders/referenceEntity.loader'
import { ClassService } from './class.service'
import { InstructionService } from './instruction.service'
import { LocalVariableService } from './localVariable.service'
import { ReferenceEntityService } from './referenceEntity.service'

export interface IDataLoaders {
    classLoaders: ClassDataLoader
    instructionLoaders: InstructionDataLoader
    variableLoaders: LocalVariableDataLoader
    referenceLoaders: ReferenceLoader
}

@Injectable()
export class DataLoaderService {
    constructor(
        private readonly classService: ClassService,
        private readonly instructionService: InstructionService,
        private readonly variableService: LocalVariableService,
        private readonly referenceService: ReferenceEntityService,
    ) {}

    getLoaders(): IDataLoaders {
        return {
            classLoaders: new ClassDataLoader(this.classService),
            instructionLoaders: new InstructionDataLoader(
                this.instructionService,
            ),
            variableLoaders: new LocalVariableDataLoader(this.variableService),
            referenceLoaders: new ReferenceLoader(this.referenceService),
        }
    }
}
