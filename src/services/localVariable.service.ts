import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MoreThan, Repository } from 'typeorm'

@Injectable()
export class LocalVariableService {
    constructor(
        @InjectRepository(LocalVariableEntity)
        private variableRepo: Repository<LocalVariableEntity>,
    ) {}

    async findAllByMethodId(
        methodId: string,
        limit: number,
        token = '',
    ): Promise<LocalVariableEntity[]> {
        const vars = await this.variableRepo.find({
            where: {
                methodId,
                id: MoreThan(token),
            },
            take: limit,
            order: {
                id: 'asc',
            },
            cache: true,
        })
        if (vars === undefined || vars === null) {
            return []
        }

        return vars
    }
}
