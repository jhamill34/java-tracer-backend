import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InstructionClosureEntity } from 'src/entities/closures/instructionClosure.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { ReferenceEntity } from 'src/entities/reference.entity'
import { OpCode } from 'src/util/opcodeUtil'
import { In, MoreThan, MoreThanOrEqual, Repository } from 'typeorm'

@Injectable()
export class InstructionService {
    constructor(
        @InjectRepository(InstructionEntity)
        private instructionRepo: Repository<InstructionEntity>,
        @InjectRepository(InstructionClosureEntity)
        private instructionClosureRepo: Repository<InstructionClosureEntity>,
    ) {}

    async findEnteringVariablesById(
        id: string,
    ): Promise<LocalVariableEntity[]> {
        const instr = await this.instructionRepo.findOne({
            where: { id },
            relations: { enteringVariables: true },
        })

        if (instr === undefined || instr === null) {
            return null
        }

        return instr.enteringVariables
    }

    async findExitingVariablesById(id: string): Promise<LocalVariableEntity[]> {
        const instr = await this.instructionRepo.findOne({
            where: { id },
            relations: { exitingVariables: true },
        })

        if (instr === undefined || instr === null) {
            return null
        }

        return instr.exitingVariables
    }

    async findInvokedById(id: string): Promise<ReferenceEntity> {
        const instr = await this.instructionRepo.findOne({
            where: { id },
            relations: { invokedBy: true },
        })

        if (instr === undefined || instr === null) {
            return null
        }

        return instr.invokedBy
    }

    async findReferenceById(id: string): Promise<ReferenceEntity> {
        const instr = await this.instructionRepo.findOne({
            where: { id },
            relations: { reference: true },
        })

        if (instr === undefined || instr === null) {
            return null
        }

        return instr.reference
    }

    async findAllByMethodId(
        methodId: string,
        limit: number,
        token = '',
        opCodes: OpCode[] = [],
    ): Promise<InstructionEntity[]> {
        const instr = this.instructionRepo.find({
            where: {
                invokedById: methodId,
                id: MoreThan(token),
                opCode:
                    opCodes.length > 0
                        ? In(opCodes)
                        : MoreThanOrEqual(OpCode.UNKNOWN),
            },
            take: limit,
            order: {
                id: 'asc',
            },
        })

        if (instr === undefined || instr === null) {
            return []
        }

        return instr
    }

    async findNextById(instrId: string): Promise<string[]> {
        const edges = await this.instructionClosureRepo.find({
            where: {
                ancestorId: instrId,
            },
        })

        if (edges === undefined || edges === null) {
            return []
        }

        return edges.map((e) => e.childId)
    }

    async findPreviousById(instrId: string): Promise<string[]> {
        const edges = await this.instructionClosureRepo.find({
            where: {
                childId: instrId,
            },
        })

        if (edges === undefined || edges === null) {
            return []
        }

        return edges.map((e) => e.ancestorId)
    }
}
