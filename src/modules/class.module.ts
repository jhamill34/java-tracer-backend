import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassController } from 'src/controllers/class.controller'
import { AbstractClassEntity } from 'src/entities/abstractClass.entity'
import { ClassClosureEntity } from 'src/entities/closures/classClosure.entity'
import { ExtendsEntity } from 'src/entities/closures/extends.entity'
import { ImplementsEntity } from 'src/entities/closures/implements.entity'
import { InstructionClosureEntity } from 'src/entities/closures/instructionClosure.entity'
import { FieldEntity } from 'src/entities/field.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { ReferenceEntity } from 'src/entities/reference.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { ClassService } from 'src/services/class.service'
import { CompileService } from 'src/services/compile.service'
import { InstructionService } from 'src/services/instruction.service'
import { LocalVariableService } from 'src/services/localVariable.service'
import { ReferenceService } from 'src/services/reference.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([
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
        ]),
    ],
    providers: [
        CompileService,
        ClassService,
        InstructionService,
        LocalVariableService,
        ReferenceService,
    ],
    exports: [
        CompileService,
        ClassService,
        InstructionService,
        LocalVariableService,
        ReferenceService,
    ],
})
export class ClassModule {}
