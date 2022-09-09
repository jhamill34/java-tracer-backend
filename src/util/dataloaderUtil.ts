export function reduceBatch<T>(
    keys: string[],
    result: T[],
    identifier: (entity: T) => string,
): T[][] {
    const hash: Map<string, T[]> = new Map()
    result.forEach((r) => {
        const id = identifier(r)
        if (!hash.has(id)) {
            hash.set(id, [])
        }

        hash.get(id).push(r)
    })

    return keys.map((key) => hash.get(key))
}
