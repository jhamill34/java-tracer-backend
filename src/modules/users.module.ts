import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocalStrategy } from 'src/auth/local.strategy'
import { UserEntity } from 'src/entities/user.entity'
import { AuthService } from 'src/services/auth.service'
import { UsersService } from 'src/services/users.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, AuthService, LocalStrategy],
    exports: [UsersService, AuthService],
})
export class UsersModule {}
