import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { ClassModel } from 'src/models/class.model'
import {
    InstructionModel,
    InstructionModelConnection,
} from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import { VariableModelConnection } from 'src/models/variable.model'
import { InstructionService } from 'src/services/instruction.service'
import { LocalVariableService } from 'src/services/localVariable.service'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'
import { paginate, PaginationArgs } from 'src/util/paginationUtil'
import { transformLocalVariableEntity } from './instruction.resolver'

@Resolver(() => MethodModel)
export class MethodResolver {
    constructor(
        private readonly variableService: LocalVariableService,
        private readonly instructionService: InstructionService,
        private readonly referenceService: ReferenceEntityService,
    ) {}

    @ResolveField()
    async variables(
        @Parent() method: MethodModel,
        @Args() args: PaginationArgs,
    ): Promise<VariableModelConnection> {
        const variables = await this.variableService.findAllByMethodIds([
            method.id,
        ])

        return paginate(variables[0], args, transformLocalVariableEntity)
    }

    @ResolveField()
    async instructions(
        @Parent() method: MethodModel,
        @Args() args: PaginationArgs,
    ): Promise<InstructionModelConnection> {
        const instructions = await this.instructionService.findAllByMethodIds([
            method.id,
        ])

        return paginate(instructions[0], args, transformInstructionEntity)
    }

    @ResolveField()
    async owner(@Parent() method: MethodModel): Promise<ClassModel> {
        const owner = await this.referenceService.findOwnerForMethodIds([
            method.id,
        ])
        return owner[0]
    }
}

function transformInstructionEntity(
    i: InstructionEntity,
): [InstructionModel, string] {
    const { id, opCode, lineNumber, stack } = i
    const node = {
        id,
        opCode,
        lineNumber,
        stack,
    }

    return [node, id]
}
