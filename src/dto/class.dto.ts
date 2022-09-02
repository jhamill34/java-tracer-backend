import { FieldDto } from './field.dto'
import { MethodDto } from './method.dto'

export interface ClassDto {
    name: string
    hash: string
    packageName: string
    descriptor: string
    signature?: string
    interfaces: string[]
    superName: string
    modifiers: string[]
    methods: MethodDto[]
    fields: FieldDto[]
}
