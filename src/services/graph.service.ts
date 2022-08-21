import { Injectable } from '@nestjs/common'
import {
    ClassDefinition,
    MethodCall,
    MethodDefinition,
} from 'src/models/class-definition'
import {
    CallGraph,
    ClassEdgeMetadata,
    ClassGraph,
    DefinedCallGraph,
    MethodCallDefinitionMetadata,
    MethodCallMetadata,
} from 'src/models/graphs'
import { GraphImpl } from 'src/util/graph'

@Injectable()
export class GraphService {
    private readonly classGraph: ClassGraph
    private readonly definedCallGraph: DefinedCallGraph
    private readonly callGraph: CallGraph

    constructor() {
        this.classGraph = new GraphImpl<ClassDefinition, ClassEdgeMetadata>()
        this.definedCallGraph = new GraphImpl<
            MethodDefinition,
            MethodCallDefinitionMetadata
        >()

        this.callGraph = new GraphImpl<MethodCall, MethodCallMetadata>()
    }

    /**
     * This graph defines the inheritance heiarchy (i.e. which classes extend others)
     * as well as each node holds information about what methods exist on the class
     */
    getClassGraph(): ClassGraph {
        return this.classGraph
    }

    /**
     * This graph defines what methods call other methods from a compiled perspective
     * **This is not what actually gets called, use `getCallGraph` for that**
     */
    getDefinedCallGraph(): DefinedCallGraph {
        return this.definedCallGraph
    }

    /**
     * This graph defines what methods actually got called durring a runtime execution recording
     */
    getCallGraph(): CallGraph {
        return this.callGraph
    }
}
