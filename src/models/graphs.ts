import { Graph } from 'src/util/graph'
import { Trie } from 'src/util/trie'
import {
    ClassDefinition,
    MethodCall,
    MethodDefinition,
} from './class-definition'

export enum ClassRelationship {
    EXTENDS = 'EXTENDS',
    IMPLEMENTS = 'IMPLEMENTS',
}

export interface ClassEdgeMetadata {
    relationship: ClassRelationship
}

export type ClassGraph = Graph<ClassDefinition, ClassEdgeMetadata>

export interface MethodCallDefinitionMetadata {
    linenumber: number
}

export type DefinedCallGraph = Graph<
    MethodDefinition,
    MethodCallDefinitionMetadata
>

export interface MethodCallMetadata {
    duration: number
}

export type CallGraph = Graph<MethodCall, MethodCallMetadata>

export type PackageTrie = Trie<string>

export interface PackageResponse {
    className: string
    package: string
}
