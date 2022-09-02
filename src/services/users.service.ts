import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    async findOne(username: string): Promise<UserEntity> {
        return this.userRepository.findOneBy({ username })
    }

    async save(user: UserEntity): Promise<void> {
        await this.userRepository.save(user)
    }
}
