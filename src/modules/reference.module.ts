import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FieldEntity } from 'src/entities/field.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { ReferenceEntity } from 'src/entities/reference.entity'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([ReferenceEntity, MethodEntity, FieldEntity]),
    ],
    providers: [ReferenceEntityService],
    exports: [ReferenceEntityService],
})
export class ReferenceModule {}
