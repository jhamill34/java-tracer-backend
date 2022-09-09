import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { LessThan, MoreThan, Repository } from 'typeorm'

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
        reverse = false,
    ): Promise<LocalVariableEntity[]> {
        const vars = await this.variableRepo.find({
            where: {
                methodId,
                id: reverse ? LessThan(token) : MoreThan(token),
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
