import { ReferenceDto } from './reference.dto'

export interface InstructionDto {
    opCode: number
    lineNumber: number
    validLocalVariables: number[]
    methodCall?: ReferenceDto
    fieldAccess?: ReferenceDto
    branches: number[]
    stack: string[]
}
