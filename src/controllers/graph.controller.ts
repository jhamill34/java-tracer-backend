import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Query,
} from '@nestjs/common'
import {
    ClassDefinition,
    MethodCall,
    MethodDefinition,
} from 'src/models/class-definition'
import {
    ClassEdgeMetadata,
    MethodCallDefinitionMetadata,
    MethodCallMetadata,
    PackageResponse,
} from 'src/models/graphs'
import { GraphService } from 'src/services/graph.service'
import { base64Decode } from 'src/util/decoder'
import { Edge } from 'src/util/graph'
import { search, TraversalType } from 'src/util/graph-util'
import { generateMethodId } from 'src/util/identifiers'

@Controller()
export class GraphController {
    constructor(private readonly graphService: GraphService) {}

    @Get('/calls/:method')
    getCall(@Param('method') method: string): MethodCall {
        const decodedMethod = base64Decode(method)
        const methodCall = this.graphService
            .getCallGraph()
            .getNode(decodedMethod)

        if (methodCall === undefined || methodCall === null) {
            throw new NotFoundException()
        }

        return methodCall
    }

    @Get('/calls/:method/calls')
    async getSubCalls(
        @Param('method') method: string,
        @Query('declared') declared?: string,
    ): Promise<Edge<MethodCallMetadata>[]> {
        const decodedMethod = base64Decode(method)
        let edges = this.graphService.getCallGraph().getChildren(decodedMethod)

        if (edges === undefined || edges === null) {
            throw new NotFoundException()
        }

        if (
            declared !== undefined &&
            ['yes', 'y', 't', 'true'].includes(declared)
        ) {
            const methodPart = decodedMethod.split(']')[1]
            const declaredLookup = new Set<string>()
            const definedGraph = this.graphService.getDefinedCallGraph()
            const classGraph = this.graphService.getClassGraph()

            definedGraph
                .getChildren(methodPart)
                .forEach((edge) => declaredLookup.add(edge.id))

            const result = await Promise.all(
                edges.map((edge) => {
                    const edgeMethod = edge.id.split(']')[1]
                    const {
                        name: declaredMethodName,
                        className,
                        descriptor,
                        modifiers,
                    } = definedGraph.getNode(edgeMethod)

                    const isStatic = modifiers.includes('static')

                    return search(
                        TraversalType.BFS,
                        classGraph,
                        className,
                        ({ name: currentClass }) => {
                            const lookupMethod = generateMethodId(
                                currentClass,
                                declaredMethodName,
                                descriptor,
                                isStatic,
                            )
                            return declaredLookup.has(lookupMethod)
                        },
                    )
                }),
            )

            edges = edges.filter((_edge, index) => result[index])
        }

        return edges
    }

    @Get('/methods/:method')
    getMethod(@Param('method') method: string): MethodDefinition {
        const decodedMethod = base64Decode(method)
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
        const decodedMethod = base64Decode(method)
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
        const decodedClass = base64Decode(className)
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
        const decodedClass = base64Decode(className)
        const edges = this.graphService
            .getClassGraph()
            .getChildren(decodedClass)

        if (edges === undefined || edges === null) {
            throw new NotFoundException()
        }

        return edges
    }

    @Get('/classes/:class/package')
    getClassPackage(@Param('class') className: string): PackageResponse {
        const decodedClass = base64Decode(className)
        let packageName = this.graphService.getPackageGraph().get(decodedClass)

        if (packageName === undefined || packageName === null) {
            packageName = '<unknown>'
        }

        return {
            className: decodedClass,
            package: packageName,
        }
    }
}
