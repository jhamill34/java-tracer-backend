import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { ExtendsEntity } from 'src/entities/closures/extends.entity'
import { ImplementsEntity } from 'src/entities/closures/implements.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { reduceBatch } from 'src/util/dataloaderUtil'
import { In, Repository } from 'typeorm'

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(KnownClassEntity)
        private knownClassRepo: Repository<KnownClassEntity>,
        @InjectRepository(UnknownClassEntity)
        private unknownClassRepo: Repository<UnknownClassEntity>,
        @InjectRepository(ExtendsEntity)
        private extendsRepo: Repository<ExtendsEntity>,
        @InjectRepository(ImplementsEntity)
        private implementsRepo: Repository<ImplementsEntity>,
    ) {}

    async findByName(name: string): Promise<AbstractClassEntity> {
        let entity: AbstractClassEntity = await this.knownClassRepo.findOne({
            where: { name },
            cache: true,
        })
        if (entity === undefined || entity === null) {
            entity = await this.unknownClassRepo.findOneBy({ name })
        }

        return entity
    }

    async findSubClassesForClasses(
        classIds: string[],
    ): Promise<AbstractClassEntity[][]> {
        const extended = await this.extendsRepo.find({
            where: {
                ancestorId: In(classIds),
            },
            order: { childId: 'asc' },
            relations: {
                child: true,
            },
            cache: true,
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return reduceBatch(
            classIds,
            extended.map((e) => e.child),
            (e) => e.id,
        )
    }

    async findSuperClassForClasses(
        classIds: string[],
    ): Promise<AbstractClassEntity[][]> {
        const extended = await this.extendsRepo.find({
            where: {
                childId: In(classIds),
            },
            relations: {
                ancestor: true,
            },
            cache: true,
        })

        return reduceBatch(
            classIds,
            extended.map((e) => e.ancestor),
            (e) => e.id,
        )
    }

    async findImplementorsForClasses(
        classIds: string[],
    ): Promise<AbstractClassEntity[][]> {
        const extended = await this.implementsRepo.find({
            where: {
                ancestorId: In(classIds),
            },
            order: { childId: 'asc' },
            relations: {
                child: true,
            },
            cache: true,
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return reduceBatch(
            classIds,
            extended.map((e) => e.child),
            (e) => e.id,
        )
    }

    async findImplementedForClasses(
        classIds: string[],
    ): Promise<AbstractClassEntity[][]> {
        const extended = await this.implementsRepo.find({
            where: {
                childId: In(classIds),
            },
            order: { ancestorId: 'asc' },
            relations: {
                ancestor: true,
            },
            cache: true,
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return reduceBatch(
            classIds,
            extended.map((e) => e.ancestor),
            (e) => e.id,
        )
    }
}
