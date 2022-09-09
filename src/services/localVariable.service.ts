import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { reduceBatch } from 'src/util/dataloaderUtil'
import { In, Repository } from 'typeorm'

@Injectable()
export class LocalVariableService {
    constructor(
        @InjectRepository(LocalVariableEntity)
        private variableRepo: Repository<LocalVariableEntity>,
    ) {}

    async findAllByMethodIds(
        methodIds: string[],
    ): Promise<LocalVariableEntity[][]> {
        const vars = await this.variableRepo.find({
            where: {
                methodId: In(methodIds),
            },
            order: {
                id: 'asc',
            },
            cache: true,
        })

        return reduceBatch(methodIds, vars, (v) => v.methodId)
    }
}
