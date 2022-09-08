import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExtendsEntity } from 'src/entities/closures/extends.entity'
import { ImplementsEntity } from 'src/entities/closures/implements.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { ClassResolver } from 'src/resolvers/class.resolver'
import { ClassService } from 'src/services/class.service'
import { FieldModule } from './field.module'
import { MethodModule } from './method.module'
import { ReferenceModule } from './reference.module'

@Module({
    imports: [
        FieldModule,
        MethodModule,
        TypeOrmModule.forFeature([
            KnownClassEntity,
            UnknownClassEntity,
            ExtendsEntity,
            ImplementsEntity,
        ]),
        ReferenceModule,
    ],
    providers: [ClassService, ClassResolver],
    exports: [ClassService],
})
export class ClassModule {}
