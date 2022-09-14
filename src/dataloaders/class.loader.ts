import DataLoader from 'dataloader'
import { ExtendsEntity } from 'src/entities/closures/extends.entity'
import { ImplementsEntity } from 'src/entities/closures/implements.entity'
import { ClassService } from 'src/services/class.service'

export class ClassDataLoader {
    readonly subClassLoader: DataLoader<string, ExtendsEntity[]>
    readonly superClassLoader: DataLoader<string, ExtendsEntity[]>
    readonly implementorLoader: DataLoader<string, ImplementsEntity[]>
    readonly implementedLoader: DataLoader<string, ImplementsEntity[]>

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
