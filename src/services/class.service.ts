import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { ExtendsEntity } from 'src/entities/closures/extends.entity'
import { ImplementsEntity } from 'src/entities/closures/implements.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { reduceBatch } from 'src/util/dataloaderUtil'
import { In, Like, Repository } from 'typeorm'

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

    async findById(id: string): Promise<AbstractClassEntity> {
        let entity: AbstractClassEntity = await this.knownClassRepo.findOne({
            where: { id },
            cache: true,
        })

        if (!entity) {
            entity = await this.unknownClassRepo.findOne({
                where: { id },
                cache: true,
            })
        }

        return entity
    }

    async find(name?: string): Promise<AbstractClassEntity[]> {
        const knownEntities: AbstractClassEntity[] = await this.knownClassRepo
            .createQueryBuilder('klass')
            .where('klass.name <-> :name < 0.9')
            .orderBy('klass.name <-> :name', 'ASC')
            .setParameter('name', name)
            .cache(true)
            .getMany()

        let unknownEntities = []
        unknownEntities = await this.unknownClassRepo
            .createQueryBuilder('klass')
            .where('klass.name <-> :name < 0.9')
            .orderBy('klass.name <-> :name', 'ASC')
            .setParameter('name', name)
            .cache(true)
            .getMany()

        // We can do this because unknown entities have a value prefixed with 'u'
        return [...knownEntities, ...unknownEntities]
    }

    async findSubClassesForClasses(
        classIds: string[],
    ): Promise<ExtendsEntity[][]> {
        const extended = await this.extendsRepo.find({
            where: {
                ancestorId: In(classIds),
            },
            relations: {
                child: true,
            },
            cache: true,
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return reduceBatch(classIds, extended, (e) => e.ancestorId)
    }

    async findSuperClassForClasses(
        classIds: string[],
    ): Promise<ExtendsEntity[][]> {
        const extended = await this.extendsRepo.find({
            where: {
                childId: In(classIds),
            },
            relations: {
                ancestor: true,
            },
            cache: true,
        })

        return reduceBatch(classIds, extended, (e) => e.childId)
    }

    async findImplementorsForClasses(
        classIds: string[],
    ): Promise<ImplementsEntity[][]> {
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

        return reduceBatch(classIds, extended, (e) => e.ancestorId)
    }

    async findImplementedForClasses(
        classIds: string[],
    ): Promise<ImplementsEntity[][]> {
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

        return reduceBatch(classIds, extended, (e) => e.childId)
    }
}
