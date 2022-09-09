import DataLoader from 'dataloader'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { ClassService } from 'src/services/class.service'

export class ClassDataLoader {
    readonly subClassLoader: DataLoader<string, AbstractClassEntity[]>
    readonly superClassLoader: DataLoader<string, AbstractClassEntity[]>
    readonly implementorLoader: DataLoader<string, AbstractClassEntity[]>
    readonly implementedLoader: DataLoader<string, AbstractClassEntity[]>

    constructor(classService: ClassService) {
        this.subClassLoader = new DataLoader(
            async (keys: string[]) =>
                await classService.findSubClassesForClasses(keys),
        )
        this.superClassLoader = new DataLoader(
            async (keys: string[]) =>
                await classService.findSuperClassForClasses(keys),
        )
        this.implementorLoader = new DataLoader(
            async (keys: string[]) =>
                await classService.findImplementorsForClasses(keys),
        )
        this.implementedLoader = new DataLoader(
            async (keys: string[]) =>
                await classService.findImplementedForClasses(keys),
        )
    }
}
