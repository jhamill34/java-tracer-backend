import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { FieldEntity } from 'src/entities/field.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { MoreThan, Repository } from 'typeorm'

@Injectable()
export class ReferenceEntityService {
    constructor(
        @InjectRepository(MethodEntity)
        private methodRepo: Repository<MethodEntity>,
        @InjectRepository(FieldEntity)
        private fieldRepo: Repository<FieldEntity>,
    ) {}

    async findOwnerForMethodId(id: string): Promise<AbstractClassEntity> {
        const method = await this.methodRepo.findOne({
            where: { id },
            relations: { class: true },
        })

        if (method !== undefined && method !== null) {
            return method.class
        }

        return null
    }

    async findOwnerForFieldId(id: string): Promise<AbstractClassEntity> {
        const method = await this.fieldRepo.findOne({
            where: { id },
            relations: { class: true },
        })

        if (method !== undefined && method !== null) {
            return method.class
        }

        return null
    }

    async findAllMethodsForClass(
        classId: string,
        limit: number,
        token = '',
    ): Promise<MethodEntity[]> {
        return await this.methodRepo.find({
            where: {
                classId,
                id: MoreThan(token),
            },
            take: limit,
            order: {
                id: 'asc',
            },
        })
    }

    async findAllFieldsForClass(
        classId: string,
        limit: number,
        token = '',
    ): Promise<FieldEntity[]> {
        return await this.fieldRepo.find({
            where: {
                classId,
                id: MoreThan(token),
            },
            take: limit,
        })
    }
}
