import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InstructionClosureEntity } from 'src/entities/closures/instructionClosure.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { ReferenceEntity } from 'src/entities/reference.entity'
import { reduceBatch } from 'src/util/dataloaderUtil'
import { In, Repository } from 'typeorm'

@Injectable()
export class InstructionService {
    constructor(
        @InjectRepository(InstructionEntity)
        private instructionRepo: Repository<InstructionEntity>,
        @InjectRepository(InstructionClosureEntity)
        private instructionClosureRepo: Repository<InstructionClosureEntity>,
    ) {}

    async findEnteringVariablesForInstructionIds(
        ids: string[],
    ): Promise<LocalVariableEntity[][]> {
        const instr = await this.instructionRepo.find({
            where: {
                id: In(ids),
            },
            relations: { enteringVariables: true },
            order: {
                enteringVariables: { id: 'asc' },
            },
            cache: true,
        })

        return ids.map((id) => instr.find((i) => i.id === id).enteringVariables)
    }

    async findExitingVariablesForInstructionIds(
        ids: string[],
    ): Promise<LocalVariableEntity[][]> {
        const instr = await this.instructionRepo.find({
            where: {
                id: In(ids),
            },
            relations: { exitingVariables: true },
            order: {
                exitingVariables: { id: 'asc' },
            },
            cache: true,
        })

        return ids.map((id) => instr.find((i) => i.id === id).exitingVariables)
    }

    async findInvokedForInstructionIds(ids: string[]): Promise<MethodEntity[]> {
        const instr = await this.instructionRepo.find({
            where: { id: In(ids) },
            relations: { invokedBy: true },
            cache: true,
        })

        return ids.map((id) => instr.find((i) => i.id === id).invokedBy)
    }

    async findReferenceByInstructionIds(
        ids: string[],
    ): Promise<ReferenceEntity[]> {
        const instr = await this.instructionRepo.find({
            where: { id: In(ids) },
            relations: { reference: true },
            cache: true,
        })

        return ids.map((id) => instr.find((i) => i.id === id).reference)
    }

    async findAllByMethodIds(
        methodIds: string[],
    ): Promise<InstructionEntity[][]> {
        const instr = await this.instructionRepo.find({
            where: {
                invokedById: In(methodIds),
            },
            order: {
                id: 'asc',
            },
            cache: true,
        })

        return reduceBatch(methodIds, instr, (i) => i.invokedById)
    }

    async findAllInstructionsCallingMethods(
        methodIds: string[]
    ): Promise<InstructionEntity[][]> {
        const instr = await this.instructionRepo.find({
            where: {
                referenceId: In(methodIds),
            },
            order: {
                id: 'asc'
            },
            cache: true
        })

        return reduceBatch(methodIds, instr, (i) => i.referenceId)
    }

    async findNextByInstructionIds(
        instrIds: string[],
    ): Promise<InstructionClosureEntity[][]> {
        const edges = await this.instructionClosureRepo.find({
            where: {
                ancestorId: In(instrIds),
            },
            cache: true,
        })

        return reduceBatch(instrIds, edges, (e) => e.ancestorId)
    }

    async findPreviousByInstructionIds(
        instrIds: string[],
    ): Promise<InstructionClosureEntity[][]> {
        const edges = await this.instructionClosureRepo.find({
            where: {
                childId: In(instrIds),
            },
            cache: true,
        })

        return reduceBatch(instrIds, edges, (e) => e.childId)
    }
}
