import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InstructionClosureEntity } from 'src/entities/closures/instructionClosure.entity'
import { InstructionEntity } from 'src/entities/instruction.entity'
import { LocalVariableEntity } from 'src/entities/localVariable.entity'
import { MethodEntity } from 'src/entities/method.entity'
import { ReferenceEntity } from 'src/entities/reference.entity'
import { OpCode } from 'src/util/opcodeUtil'
import { In, LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm'

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
        limit: number,
        token: string,
        reverse = false,
    ): Promise<LocalVariableEntity[]> {
        const instr = await this.instructionRepo.findOne({
            where: {
                id,
                enteringVariables: {
                    id: reverse ? LessThan(token) : MoreThan(token),
                },
            },
            relations: { enteringVariables: true },
            order: {
                enteringVariables: { id: 'asc' },
            },
            cache: true,
        })

        if (instr === undefined || instr === null) {
            return null
        }

        return instr.enteringVariables.slice(0, limit)
    }

    async findExitingVariablesById(
        id: string,
        limit: number,
        token: string,
        reverse = false,
    ): Promise<LocalVariableEntity[]> {
        const instr = await this.instructionRepo.findOne({
            where: {
                id,
                exitingVariables: {
                    id: reverse ? LessThan(token) : MoreThan(token),
                },
            },
            relations: { exitingVariables: true },
            order: {
                exitingVariables: { id: 'asc' },
            },
            cache: true,
        })

        if (instr === undefined || instr === null) {
            return null
        }

        return instr.exitingVariables.slice(0, limit)
    }

    async findInvokedById(id: string): Promise<MethodEntity> {
        const instr = await this.instructionRepo.findOne({
            where: { id },
            relations: { invokedBy: true },
            cache: true,
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
            cache: true,
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
        opCodes: OpCode[],
        reverse = false,
    ): Promise<InstructionEntity[]> {
        const instr = this.instructionRepo.find({
            where: {
                invokedById: methodId,
                id: reverse ? LessThan(token) : MoreThan(token),
                opCode:
                    opCodes.length === 0
                        ? MoreThanOrEqual(OpCode.UNKNOWN)
                        : In(opCodes),
            },
            take: limit,
            order: {
                id: 'asc',
            },
            cache: true,
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
            cache: true,
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
            cache: true,
        })

        if (edges === undefined || edges === null) {
            return []
        }

        return edges.map((e) => e.ancestorId)
    }
}
