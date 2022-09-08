import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FieldModel } from 'src/models/field.model'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'

@Resolver(() => FieldModel)
export class FieldResolver {
    constructor(private readonly referenceService: ReferenceEntityService) {}

    @ResolveField()
    async owner(@Parent() field: FieldModel) {
        return await this.referenceService.findOwnerForFieldId(field.id)
    }
}
