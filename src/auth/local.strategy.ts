import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { UserRequestDto, UserResponseDto } from 'src/dto/user.dto'
import { AuthService } from 'src/services/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super()
    }

    async validate(userReq: UserRequestDto): Promise<UserResponseDto> {
        const user = await this.authService.validateUser(userReq)

        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}
