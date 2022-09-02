import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ReferenceDto } from 'src/dto/reference.dto'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { FieldEntity } from 'src/entities/field.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { ReferenceEntity } from 'src/entities/reference.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { Repository } from 'typeorm'
import { ClassService } from './class.service'

@Injectable()
export class ReferenceService {
    constructor(
        @InjectRepository(FieldEntity)
        private fieldRepo: Repository<FieldEntity>,
        @InjectRepository(MethodEntity)
        private methodRepo: Repository<MethodEntity>,
        private readonly classService: ClassService,
    ) {}

    private async findOrCreateClass(
        className: string,
        jobToken: string,
    ): Promise<AbstractClassEntity> {
        let classEntity = await this.classService.findByName(
            className,
            jobToken,
        )

        if (classEntity === null) {
            classEntity = new UnknownClassEntity()
            classEntity.name = className
            classEntity.jobToken = jobToken
            await this.classService.saveUnknown(classEntity)
        }

        return classEntity
    }

    private async findOrCreateReference<T extends ReferenceEntity>(
        ref: ReferenceDto,
        repo: Repository<T>,
        creator: () => T,
        isStatic: boolean,
        jobToken: string,
    ): Promise<T> {
        const classEntity = await this.findOrCreateClass(
            ref.className,
            jobToken,
        )

        let entity = await repo
            .createQueryBuilder('ref')
            .where(
                'ref.classId = :id and ref.name = :name and ref.descriptor = :descriptor and ref.jobToken = :jobToken',
                {
                    id: classEntity.id,
                    name: ref.name,
                    descriptor: ref.descriptor,
                    jobToken,
                },
            )
            .getOne()

        if (entity === null) {
            entity = creator()
            entity.name = ref.name
            entity.descriptor = ref.descriptor
            entity.modifiers = ['public']
            if (isStatic) {
                entity.modifiers.push('static')
            }

            entity.jobToken = jobToken
            entity.class = classEntity
        }

        return await repo.save(entity)
    }

    private createEmptyField(): FieldEntity {
        return new FieldEntity()
    }

    private createEmptyMethod(): MethodEntity {
        return new MethodEntity()
    }

    async findOrCreateField(
        ref: ReferenceDto,
        isStatic = false,
        jobToken: string,
    ): Promise<FieldEntity> {
        return await this.findOrCreateReference(
            ref,
            this.fieldRepo,
            this.createEmptyField,
            isStatic,
            jobToken,
        )
    }

    async findOrCreateMethod(
        ref: ReferenceDto,
        isStatic = false,
        jobToken: string,
    ): Promise<MethodEntity> {
        return await this.findOrCreateReference(
            ref,
            this.methodRepo,
            this.createEmptyMethod,
            isStatic,
            jobToken,
        )
    }

    async saveField(field: FieldEntity): Promise<void> {
        await this.fieldRepo.save(field)
    }

    async saveMethod(method: MethodEntity): Promise<void> {
        await this.methodRepo.save(method)
    }
}
