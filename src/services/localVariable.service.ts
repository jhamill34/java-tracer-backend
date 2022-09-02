import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LocalVariableDto } from 'src/dto/localVariable.dto'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { Repository } from 'typeorm'

@Injectable()
export class LocalVariableService {
    constructor(
        @InjectRepository(LocalVariableEntity)
        private localVariableRepo: Repository<LocalVariableEntity>,
    ) {}

    async save(variable: LocalVariableDto): Promise<void> {
        await this.localVariableRepo.save(variable)
    }
}
