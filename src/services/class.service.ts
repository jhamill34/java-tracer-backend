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
        private classRepository: Repository<KnownClassEntity>,
        @InjectRepository(UnknownClassEntity)
        private unknownClassRepository: Repository<UnknownClassEntity>,
        @InjectRepository(ImplementsEntity)
        private interfaceRepository: Repository<ImplementsEntity>,
        @InjectRepository(ExtendsEntity)
        private extendsRepository: Repository<ExtendsEntity>,
    ) {}

    async findByName(
        name: string,
        jobToken: string,
    ): Promise<AbstractClassEntity> {
        const known = await this.findKnownByName(name, jobToken)
        if (known !== null) {
            return known
        }

        return await this.findUnknownByName(name, jobToken)
    }

    async findKnownByName(
        name: string,
        jobToken: string,
    ): Promise<KnownClassEntity> {
        return await this.classRepository.findOneBy({ name, jobToken })
    }

    async findUnknownByName(
        name: string,
        jobToken: string,
    ): Promise<UnknownClassEntity> {
        return await this.unknownClassRepository.findOneBy({ name, jobToken })
    }

    async saveKnown(classEntity: KnownClassEntity): Promise<void> {
        await this.classRepository.save(classEntity)
    }

    async saveUnknown(classEntity: UnknownClassEntity): Promise<void> {
        await this.unknownClassRepository.save(classEntity)
    }

    async saveSuperClass(
        subClass: AbstractClassEntity,
        superClass: AbstractClassEntity,
    ): Promise<void> {
        if (subClass.jobToken !== superClass.jobToken) {
            return
        }

        const edge = new ExtendsEntity()
        edge.ancestor = subClass
        edge.child = superClass
        edge.jobToken = subClass.jobToken

        await this.extendsRepository.save(edge)
    }

    async saveInterface(
        implementor: AbstractClassEntity,
        interfaceEntity: AbstractClassEntity,
    ): Promise<void> {
        if (implementor.jobToken !== interfaceEntity.jobToken) {
            return
        }

        const edge = new ImplementsEntity()
        edge.ancestor = implementor
        edge.child = interfaceEntity
        edge.jobToken = implementor.jobToken

        await this.interfaceRepository.save(edge)
    }
}
