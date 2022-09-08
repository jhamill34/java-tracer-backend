import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { ExtendsEntity } from 'src/entities/closures/extends.entity'
import { ImplementsEntity } from 'src/entities/closures/implements.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { MoreThan, Repository } from 'typeorm'

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

    async findSubClass(
        classId: string,
        limit: number,
        token: string,
    ): Promise<AbstractClassEntity[]> {
        const extended = await this.extendsRepo.find({
            where: {
                ancestorId: classId,
                childId: MoreThan(token),
            },
            take: limit,
            order: { childId: 'asc' },
            relations: {
                child: true,
            },
            cache: true,
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return extended.map((e) => e.child)
    }

    async findSuperClass(classId: string): Promise<AbstractClassEntity> {
        const extended = await this.extendsRepo.findOne({
            where: {
                childId: classId,
            },
            relations: {
                ancestor: true,
            },
            cache: true,
        })

        return extended.ancestor
    }

    async findImplementors(
        classId: string,
        limit: number,
        token: string,
    ): Promise<AbstractClassEntity[]> {
        const extended = await this.implementsRepo.find({
            where: {
                ancestorId: classId,
                childId: MoreThan(token),
            },
            order: { childId: 'asc' },
            take: limit,
            relations: {
                child: true,
            },
            cache: true,
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return extended.map((e) => e.child)
    }

    async findImplemented(
        classId: string,
        limit: number,
        token: string,
    ): Promise<AbstractClassEntity[]> {
        const extended = await this.implementsRepo.find({
            where: {
                childId: classId,
                ancestorId: MoreThan(token),
            },
            take: limit,
            order: { ancestorId: 'asc' },
            relations: {
                ancestor: true,
            },
            cache: true,
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return extended.map((e) => e.ancestor)
    }
}
