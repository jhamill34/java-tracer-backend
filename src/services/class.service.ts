import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { ExtendsEntity } from 'src/entities/closures/extends.entity'
import { ImplementsEntity } from 'src/entities/closures/implements.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { Repository } from 'typeorm'

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
        let entity: AbstractClassEntity = await this.knownClassRepo.findOneBy({
            name,
        })
        if (entity === undefined || entity === null) {
            entity = await this.unknownClassRepo.findOneBy({ name })
        }

        return entity
    }

    async findSubClass(classId: string): Promise<AbstractClassEntity[]> {
        const extended = await this.extendsRepo.find({
            where: {
                ancestorId: classId,
            },
            relations: {
                child: true,
            },
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
        })

        return extended.ancestor
    }

    async findImplementors(classId: string): Promise<AbstractClassEntity[]> {
        const extended = await this.implementsRepo.find({
            where: {
                ancestorId: classId,
            },
            relations: {
                child: true,
            },
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return extended.map((e) => e.child)
    }

    async findImplemented(classId: string): Promise<AbstractClassEntity[]> {
        const extended = await this.implementsRepo.find({
            where: {
                childId: classId,
            },
            relations: {
                ancestor: true,
            },
        })

        if (extended === undefined || extended === null) {
            return []
        }

        return extended.map((e) => e.ancestor)
    }
}
