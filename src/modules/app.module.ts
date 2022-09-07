import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { ClassClosureEntity } from 'src/entities/closures/classClosure.entity'
import { ExtendsEntity } from 'src/entities/closures/extends.entity'
import { ImplementsEntity } from 'src/entities/closures/implements.entity'
import { InstructionClosureEntity } from 'src/entities/closures/instructionClosure.entity'
import { FieldEntity } from 'src/entities/field.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { JobEntity } from 'src/entities/job.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { ReferenceEntity } from 'src/entities/reference.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { UserEntity } from 'src/entities/user.entity'
import { UsersModule } from './users.module'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            username: 'joshrasm',
            database: 'javatrace',
            port: 5432,
            entities: [
                ClassClosureEntity,
                ExtendsEntity,
                ImplementsEntity,
                InstructionClosureEntity,

                AbstractClassEntity,
                FieldEntity,
                InstructionEntity,
                KnownClassEntity,
                LocalVariableEntity,
                MethodEntity,
                ReferenceEntity,
                UnknownClassEntity,

                JobEntity,

                UserEntity,
            ],
            // synchronize: true,
            // logging: true,
        }),
        UsersModule,
    ],
})
export class AppModule {}
