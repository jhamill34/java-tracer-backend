import * as bcrypt from 'bcryptjs'
import { Injectable } from '@nestjs/common'
import { UserEntity } from 'src/entities/user.entity'
import { UsersService } from './users.service'
import { UserRequestDto, UserResponseDto } from 'src/dto/user.dto'

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async validateUser(userReq: UserRequestDto): Promise<UserResponseDto> {
        const { username, password } = userReq
        const user = await this.usersService.findOne(username)
        if (user && bcrypt.compare(password, user.password)) {
            const result: Omit<UserEntity, 'password'> = user
            delete result['password']

            return result
        }

        return null
    }

    async signup(userReq: UserRequestDto): Promise<UserResponseDto> {
        const { username, password } = userReq
        const user = new UserEntity()
        user.username = username
        user.password = await bcrypt.hash(password, 10)

        await this.usersService.save(user)

        const result: Omit<UserEntity, 'password'> = user
        delete result['password']

        return result
    }
}
