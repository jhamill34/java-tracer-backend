import { BullModule } from '@nestjs/bull'
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
import { ClassModule } from './class.module'
import { FileModule } from './file.module'
import { ProviderModule } from './provider.module'
import { UsersModule } from './users.module'

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: 'sqlite.db',
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
            synchronize: true,
            // logging: true,
        }),
        ClassModule,
        FileModule,
        UsersModule,
        ProviderModule,
    ],
})
export class WorkerModule {}
