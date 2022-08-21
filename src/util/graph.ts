export interface Graph<N, E> {
    add(id: string, node: N): void
    connect(from: string, to: string, type: E): void
    getNode(id: string): N
    getAllNodeIds(): Map<string, N>
    getChildren(id: string): Edge<E>[]
    contains(id: string): boolean
}

export interface Edge<D> {
    id: string
    metadata: D
}

export class GraphImpl<N, E> implements Graph<N, E> {
    private readonly adj: Map<string, Edge<E>[]>
    private readonly nodes: Map<string, N>

    constructor() {
        this.adj = new Map<string, Edge<E>[]>()
        this.nodes = new Map<string, N>()
    }

    add(id: string, node: N): void {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, node)
        }

        if (!this.adj.has(id)) {
            this.adj.set(id, [])
        }
    }

    connect(from: string, to: string, metadata: E): void {
        if (!this.adj.has(from)) {
            this.adj.set(from, [])
        }

        this.adj.get(from).push({
            id: to,
            metadata,
        })
    }

    getNode(id: string): N {
        return this.nodes.get(id)
    }

    getAllNodeIds(): Map<string, N> {
        return this.nodes
    }

    getChildren(id: string): Edge<E>[] {
        return this.adj.get(id)
    }

    contains(id: string): boolean {
        return this.nodes.has(id)
    }
}
