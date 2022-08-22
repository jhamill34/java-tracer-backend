// Ideas: Most expensive/cheapest path, find loops, find bottlenecks, MVP

import EventEmitter from 'events'
import { Edge, Graph } from './graph'

export enum TraversalType {
    BFS,
    DFS,
}

type GraphTraversalEvent<N, E> = {
    node: (node: N) => void
    edge: (edge: Edge<E>) => void
    complete: () => void
    error: (error: any) => void
}

interface GraphTraversalEmitter<N, E> {
    emit<U extends keyof GraphTraversalEvent<N, E>>(
        event: U,
        ...args: Parameters<GraphTraversalEvent<N, E>[U]>
    ): boolean
}

export interface GraphTraversalListener<N, E> {
    on<U extends keyof GraphTraversalEvent<N, E>>(
        event: U,
        listener: GraphTraversalEvent<N, E>[U],
    ): this
}

export interface GraphTraversalEventEmitter<N, E>
    extends GraphTraversalEmitter<N, E>,
        GraphTraversalListener<N, E> {}

export class GraphTraversalEventEmitterImpl<N, E>
    extends EventEmitter
    implements GraphTraversalEventEmitter<N, E> {}

export interface TraversalListener<N, E> extends GraphTraversalListener<N, E> {
    start(nodeId: string): void
}
export class BFSTraversal<N, E> implements TraversalListener<N, E> {
    constructor(
        private readonly graph: Graph<N, E>,
        private readonly emitter: GraphTraversalEventEmitter<N, E>,
    ) {}

    on<U extends keyof GraphTraversalEvent<N, E>>(
        event: U,
        listener: GraphTraversalEvent<N, E>[U],
    ): this {
        this.emitter.on(event, listener)
        return this
    }

    start(nodeId: string): void {
        try {
            const queue = [nodeId]

            while (queue.length > 0) {
                const current = queue.shift()
                const currentNode = this.graph.getNode(current)

                if (currentNode !== undefined && currentNode !== null) {
                    this.emitter.emit('node', currentNode)
                }

                const children = this.graph.getChildren(current)
                if (children !== undefined && children !== null) {
                    children.forEach((child) => {
                        this.emitter.emit('edge', child)
                        queue.push(child.id)
                    })
                }
            }

            this.emitter.emit('complete')
        } catch (e) {
            this.emitter.emit('error', e)
        }
    }
}

export class DFSTraversal<N, E> implements TraversalListener<N, E> {
    constructor(
        private readonly graph: Graph<N, E>,
        private readonly emitter: GraphTraversalEventEmitter<N, E>,
    ) {}

    on<U extends keyof GraphTraversalEvent<N, E>>(
        event: U,
        listener: GraphTraversalEvent<N, E>[U],
    ): this {
        this.emitter.on(event, listener)
        return this
    }

    start(nodeId: string): void {
        throw new Error('Method not implemented.')
    }
}

interface CreateTraversalOptions<N, E> {
    graph: Graph<N, E>
    type: TraversalType
}

export function createTraversal<N, E>(
    options: CreateTraversalOptions<N, E>,
): TraversalListener<N, E> {
    const { type, graph } = options
    const eventEmitter = new GraphTraversalEventEmitterImpl<N, E>()

    switch (type) {
        case TraversalType.BFS:
            return new BFSTraversal(graph, eventEmitter)
        case TraversalType.DFS:
            return new DFSTraversal(graph, eventEmitter)
    }
}

export async function search<N, E>(
    type: TraversalType,
    graph: Graph<N, E>,
    startingId: string,
    predicate: (node: N) => boolean,
): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const traversal = createTraversal({ type, graph })
        traversal
            .on('node', (node) => {
                if (predicate(node)) {
                    resolve(true)
                }
            })
            .on('complete', () => {
                resolve(false)
            })
            .on('error', reject)
            .start(startingId)
    })
}
