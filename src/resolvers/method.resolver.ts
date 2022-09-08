import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { InstructionModel } from 'src/models/instruction.model'
import { MethodModel } from 'src/models/method.model'
import { VariableModel } from 'src/models/variable.model'
import { InstructionService } from 'src/services/instruction.service'
import { LocalVariableService } from 'src/services/localVariable.service'
import { ReferenceEntityService } from 'src/services/referenceEntity.service'
import { OpCode } from 'src/util/opcodeUtil'

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
        @Args('limit', { defaultValue: 10 }) limit: number,
        @Args('token', { defaultValue: '' }) token: string,
    ): Promise<VariableModel[]> {
        return await this.variableService.findAllByMethodId(
            method.id,
            limit,
            token,
        )
    }

    @ResolveField()
    async instructions(
        @Parent() method: MethodModel,
        @Args('limit', { defaultValue: 10 }) limit: number,
        @Args('token', { defaultValue: '' }) token: string,
        @Args('opCodes', { defaultValue: [], type: () => [OpCode] })
        opCodes: OpCode[],
    ): Promise<InstructionModel[]> {
        return await this.instructionService.findAllByMethodId(
            method.id,
            limit,
            token,
            opCodes,
        )
    }

    @ResolveField()
    async owner(@Parent() method: MethodModel) {
        return await this.referenceService.findOwnerForMethodId(method.id)
    }
}
