export interface Parser<T> {
    extract(buffer: Buffer): T
}
