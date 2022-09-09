import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ClassModel } from 'src/models/class.model'
import { FieldModel } from 'src/models/field.model'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'

@Resolver(() => FieldModel)
export class FieldResolver {
    constructor(private readonly referenceService: ReferenceEntityService) {}

    @ResolveField()
    async owner(@Parent() field: FieldModel): Promise<ClassModel> {
        const owners = await this.referenceService.findOwnerForFieldIds([
            field.id,
        ])
        return owners[0]
    }
}
