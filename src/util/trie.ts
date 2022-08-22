export interface Trie<T> {
    add(key: string, data: T): void
    get(key: string): T
}

class TrieNode<T> {
    constructor(
        public data: T = null,
        readonly children: Map<string, TrieNode<T>> = new Map<
            string,
            TrieNode<T>
        >(),
    ) {}
}

export class TrieImpl<T> implements Trie<T> {
    private readonly root: TrieNode<T> = new TrieNode<T>()

    add(key: string, data: T): void {
        const parts = key.split('/')

        let current = this.root

        for (let i = 0; i < parts.length; i++) {
            if (!current.children.has(parts[i])) {
                current.children.set(parts[i], new TrieNode<T>())
            }

            current = current.children.get(parts[i])
        }

        current.data = data
    }

    get(key: string): T {
        const parts = key.split('/')

        let current = this.root
        for (let i = 0; i < parts.length; i++) {
            if (!current.children.has(parts[i])) {
                return null
            }

            current = current.children.get(parts[i])
        }

        return current.data
    }
}
