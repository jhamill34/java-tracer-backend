import { Graph } from './graph'

export enum TraversalType {
    BFS,
    DFS,
}

// export function createTraversal<N>(graph: Graph<N>, type: TraversalType) {
//     switch (type) {
//         case TraversalType.BFS:
//             bfsTraversal(graph)
//             break
//         case TraversalType.DFS:
//             dfsTraversal(graph)
//             break
//     }
// }

// function bfsTraversal<N>(graph: Graph<N>) {
//     throw new Error('Not implemented!')
// }

// function dfsTraversal<N>(graph: Graph<N>) {
//     throw new Error('Not implemented!')
// }
