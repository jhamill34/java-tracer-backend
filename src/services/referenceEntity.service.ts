import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { FieldEntity } from 'src/entities/field.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { reduceBatch } from 'src/util/dataloaderUtil'
import { In, Repository } from 'typeorm'

@Injectable()
export class ReferenceEntityService {
    constructor(
        @InjectRepository(MethodEntity)
        private methodRepo: Repository<MethodEntity>,
        @InjectRepository(FieldEntity)
        private fieldRepo: Repository<FieldEntity>,
    ) {}

    async findOwnerForMethodIds(ids: string[]): Promise<AbstractClassEntity[]> {
        const methods = await this.methodRepo.find({
            where: { id: In(ids) },
            relations: { class: true },
            cache: true,
        })

        return ids.map((id) => methods.find((m) => m.id === id).class)
    }

    async findOwnerForFieldIds(ids: string[]): Promise<AbstractClassEntity[]> {
        const fields = await this.fieldRepo.find({
            where: { id: In(ids) },
            relations: { class: true },
            cache: true,
        })

        return ids.map((id) => fields.find((m) => m.id === id).class)
    }

    async findAllMethodsForClasses(
        classIds: string[],
    ): Promise<MethodEntity[][]> {
        const result = await this.methodRepo.find({
            where: {
                classId: In(classIds),
            },
            order: {
                id: 'asc',
            },
            cache: true,
        })

        return reduceBatch(classIds, result, (r) => r.classId)
    }

    async findAllFieldsForClasses(
        classIds: string[],
    ): Promise<FieldEntity[][]> {
        const result = await this.fieldRepo.find({
            where: {
                classId: In(classIds),
            },
            order: {
                id: 'asc',
            },
            cache: true,
        })

        return reduceBatch(classIds, result, (r) => r.classId)
    }
}
