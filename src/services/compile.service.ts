import { Injectable, Logger } from '@nestjs/common'
import { ClassDto } from 'src/dto/class.dto'
import { TokenDto } from 'src/dto/token.dto'
import { FieldEntity } from 'src/entities/field.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { KnownClassEntity } from 'src/entities/knownClass.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { UnknownClassEntity } from 'src/entities/unknownClass.entity'
import { ClassService } from './class.service'
import { InstructionService } from './instruction.service'
import { LocalVariableService } from './localVariable.service'
import { ReferenceService } from './reference.service'

export interface Value<T> {
    value: T
}
@Injectable()
export class CompileService {
    private readonly logger = new Logger('CompileService')

    constructor(
        private readonly classService: ClassService,
        private readonly instructionService: InstructionService,
        private readonly variableService: LocalVariableService,
        private readonly referenceService: ReferenceService,
    ) {}

    async extract(buffer: Buffer, token: TokenDto): Promise<void> {
        const lines = buffer
            .toString()
            .split('\n')
            .filter((line) => line.trim().length > 0)

        const classes: KnownClassEntity[] = []
        const classDtos: ClassDto[] = []
        for (const line of lines) {
            const json = JSON.parse(line)
            if (isClassDto(json)) {
                const classEntity = await this.handleLine(json.value, token)
                classes.push(classEntity)
                classDtos.push(json.value)
            }
        }

        for (const idx in classes) {
            await this.handleRelationships(classes[idx], classDtos[idx], token)
        }
    }

    private async handleLine(
        classDto: ClassDto,
        jobToken: TokenDto,
    ): Promise<KnownClassEntity> {
        const { token } = jobToken
        const classEntity = new KnownClassEntity()
        classEntity.name = classDto.name
        classEntity.hash = classDto.hash
        classEntity.packageName = classDto.packageName
        classEntity.signature = classDto.signature
        classEntity.modifiers = classDto.modifiers

        const methods: MethodEntity[] = []
        for (const m of classDto.methods) {
            const method = new MethodEntity()

            method.name = m.name
            method.descriptor = m.descriptor
            method.signature = m.signature
            method.modifiers = m.modifiers
            method.parameters = m.parameters

            const variables: LocalVariableEntity[] = []
            for (const v of m.localVariables) {
                const variable = new LocalVariableEntity()
                variable.name = v.name
                variable.descriptor = v.descriptor
                variable.signature = v.signature
                variable.jobToken = token
                await this.variableService.save(variable)

                variables.push(variable)
            }
            method.localVariables = variables

            const instructions: InstructionEntity[] = []
            for (const i of m.instructions) {
                const instruction = new InstructionEntity()
                instruction.localVariables = i.validLocalVariables.map((v) => {
                    const variable = new LocalVariableEntity()
                    const { descriptor, name, signature } = m.localVariables[v]
                    variable.descriptor = descriptor
                    variable.name = name
                    variable.signature = signature
                    return variable
                })
                instruction.opCode = i.opCode
                instruction.lineNumber = i.lineNumber
                instruction.stack = i.stack
                instruction.jobToken = token

                await this.instructionService.save(instruction)

                instructions.push(instruction)
            }

            for (const idx in m.instructions) {
                if (
                    m.instructions[idx] !== undefined &&
                    m.instructions[idx] !== null &&
                    m.instructions[idx].branches !== undefined &&
                    m.instructions[idx].branches !== null
                ) {
                    const branches = m.instructions[idx].branches.map(
                        (b) => instructions[b],
                    )

                    for (const branch of branches) {
                        await this.instructionService.saveEdge(
                            instructions[idx],
                            branch,
                        )
                    }
                }
            }

            method.instructions = instructions
            method.jobToken = token
            await this.referenceService.saveMethod(method)

            methods.push(method)
        }
        classEntity.methods = methods

        const fields: FieldEntity[] = []
        for (const f of classDto.fields) {
            const field = new FieldEntity()
            field.name = f.name
            field.descriptor = f.descriptor
            field.signature = f.signature
            field.initialValue = f.initialValue
            field.modifiers = f.modifiers
            field.jobToken = token

            await this.referenceService.saveField(field)

            fields.push(field)
        }
        classEntity.fields = fields
        classEntity.jobToken = token

        await this.classService.saveKnown(classEntity)

        return classEntity
    }

    private async handleRelationships(
        classEntity: KnownClassEntity,
        classDto: ClassDto,
        jobToken: TokenDto,
    ): Promise<void> {
        const { token } = jobToken
        if (classDto.superName !== undefined && classDto.superName !== null) {
            const knownSuperClass = await this.classService.findKnownByName(
                classDto.superName,
                token,
            )

            if (knownSuperClass !== null) {
                await this.classService.saveSuperClass(
                    classEntity,
                    knownSuperClass,
                )
            } else {
                let unknownSuperClass =
                    await this.classService.findUnknownByName(
                        classDto.superName,
                        token,
                    )

                if (unknownSuperClass === null) {
                    unknownSuperClass = new UnknownClassEntity()
                    unknownSuperClass.name = classDto.superName
                    unknownSuperClass.jobToken = token
                    await this.classService.saveUnknown(unknownSuperClass)
                }

                await this.classService.saveSuperClass(
                    classEntity,
                    unknownSuperClass,
                )
            }
        }

        if (classDto.interfaces !== undefined && classDto.interfaces !== null) {
            for (const interfaceName of classDto.interfaces) {
                const knownInterface = await this.classService.findKnownByName(
                    interfaceName,
                    token,
                )

                if (knownInterface !== null) {
                    await this.classService.saveInterface(
                        classEntity,
                        knownInterface,
                    )
                } else {
                    let unknownInterface =
                        await this.classService.findUnknownByName(
                            interfaceName,
                            token,
                        )

                    if (unknownInterface === null) {
                        unknownInterface = new UnknownClassEntity()
                        unknownInterface.name = interfaceName
                        unknownInterface.jobToken = token
                        await this.classService.saveUnknown(unknownInterface)
                    }

                    await this.classService.saveInterface(
                        classEntity,
                        unknownInterface,
                    )
                }
            }
        }

        for (const m in classDto.methods) {
            const methodDto = classDto.methods[m]
            const methodEntity = classEntity.methods[m]
            for (const i in methodDto.instructions) {
                const instructionDto = methodDto.instructions[i]
                const instructionEntity = methodEntity.instructions[i]

                if (
                    instructionDto.fieldAccess !== undefined &&
                    instructionDto.fieldAccess !== null
                ) {
                    const existingField =
                        await this.referenceService.findOrCreateField(
                            instructionDto.fieldAccess,
                            [178, 179].includes(instructionDto.opCode),
                            token,
                        )
                    instructionEntity.reference = existingField
                    instructionEntity.jobToken = token
                    await this.instructionService.save(instructionEntity)
                } else if (
                    instructionDto.fieldAccess !== undefined &&
                    instructionDto.fieldAccess !== null
                ) {
                    const existingMethod =
                        await this.referenceService.findOrCreateMethod(
                            instructionDto.methodCall,
                            [178, 179].includes(instructionDto.opCode),
                            token,
                        )
                    instructionEntity.reference = existingMethod
                    instructionEntity.jobToken = token
                    await this.instructionService.save(instructionEntity)
                }
            }
        }
    }
}

function isClassDto(json: any): json is Value<ClassDto> {
    return json && json.value && json.value.name && json.value.methods
}
