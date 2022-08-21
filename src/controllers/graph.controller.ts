import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ClassDefinition, MethodDefinition } from 'src/models/class-definition'
import {
    ClassEdgeMetadata,
    MethodCallDefinitionMetadata,
} from 'src/models/graphs'
import { GraphService } from 'src/services/graph.service'
import { Edge } from 'src/util/graph'

@Controller()
export class GraphController {
    constructor(private readonly graphService: GraphService) {}

    @Get('/methods')
    getMethods(): any {
        return Object.fromEntries(
            this.graphService.getDefinedCallGraph().getAllNodeIds(),
        )
    }

    @Get('/methods/:method')
    getMethod(@Param('method') method: string): MethodDefinition {
        const decodedMethod = Buffer.from(method, 'base64')
            .toString('utf8')
            .trim()
        const methodDef = this.graphService
            .getDefinedCallGraph()
            .getNode(decodedMethod)

        if (methodDef === undefined || methodDef === null) {
            throw new NotFoundException()
        }

        return methodDef
    }

    @Get('/methods/:method/calls')
    getMethodCalls(
        @Param('method') method: string,
    ): Edge<MethodCallDefinitionMetadata>[] {
        const decodedMethod = Buffer.from(method, 'base64')
            .toString('utf8')
            .trim()
        const edges = this.graphService
            .getDefinedCallGraph()
            .getChildren(decodedMethod)

        if (edges === undefined || edges === null) {
            throw new NotFoundException()
        }

        return edges
    }

    @Get('/classes')
    getClassIds(): any {
        return Object.fromEntries(
            this.graphService.getClassGraph().getAllNodeIds(),
        )
    }

    @Get('/classes/:class')
    getClass(@Param('class') className: string): ClassDefinition {
        const decodedClass = Buffer.from(className, 'base64')
            .toString('utf8')
            .trim()
        const classDef = this.graphService.getClassGraph().getNode(decodedClass)

        if (classDef === undefined || classDef === null) {
            throw new NotFoundException()
        }

        return classDef
    }

    @Get('/classes/:class/relationships')
    getClassRelationships(
        @Param('class') className: string,
    ): Edge<ClassEdgeMetadata>[] {
        const decodedClass = Buffer.from(className, 'base64')
            .toString('utf8')
            .trim()
        const edges = this.graphService
            .getClassGraph()
            .getChildren(decodedClass)

        if (edges === undefined || edges === null) {
            throw new NotFoundException()
        }

        return edges
    }
}
