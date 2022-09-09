import DataLoader from 'dataloader'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { FieldEntity } from 'src/entities/field.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'

export class ReferenceLoader {
    readonly methodOwnerLoader: DataLoader<string, AbstractClassEntity>
    readonly fieldOwnerLoader: DataLoader<string, AbstractClassEntity>
    readonly classMethodsLoader: DataLoader<string, MethodEntity[]>
    readonly classFieldsLoader: DataLoader<string, FieldEntity[]>

    constructor(referenceService: ReferenceEntityService) {
        this.methodOwnerLoader = new DataLoader(
            async (keys: string[]) =>
                await referenceService.findOwnerForMethodIds(keys),
        )
        this.fieldOwnerLoader = new DataLoader(
            async (keys: string[]) =>
                await referenceService.findOwnerForFieldIds(keys),
        )
        this.classMethodsLoader = new DataLoader(
            async (keys: string[]) =>
                await referenceService.findAllMethodsForClasses(keys),
        )
        this.classFieldsLoader = new DataLoader(
            async (keys: string[]) =>
                await referenceService.findAllFieldsForClasses(keys),
        )
    }
}
