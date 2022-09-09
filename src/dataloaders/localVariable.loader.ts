import DataLoader from 'dataloader'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { LocalVariableService } from 'src/services/localVariable.service'

export class LocalVariableDataLoader {
    readonly forMethodLoader: DataLoader<string, LocalVariableEntity[]>

    constructor(variableService: LocalVariableService) {
        this.forMethodLoader = new DataLoader(
            async (keys: string[]) =>
                await variableService.findAllByMethodIds(keys),
        )
    }
}
