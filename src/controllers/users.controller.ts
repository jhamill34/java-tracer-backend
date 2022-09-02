import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserRequestDto, UserResponseDto } from 'src/dto/user.dto'
import { AuthService } from 'src/services/auth.service'

@Controller()
export class UsersController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    async signup(@Body() userReq: UserRequestDto): Promise<UserResponseDto> {
        return this.authService.signup(userReq)
    }

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req): Promise<UserResponseDto> {
        return req.user
    }
}
