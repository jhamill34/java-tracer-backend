import { InstructionDto } from './instruction.dto'
import { LocalVariableDto } from './localVariable.dto'

export interface MethodDto {
    name: string
    descriptor: string
    signature?: string
    className: string
    modifiers?: string[]
    parameters?: string[]
    localVariables: LocalVariableDto[]
    instructions: InstructionDto[]
}
