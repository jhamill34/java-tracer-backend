export function base64Decode(input: string): string {
    return Buffer.from(input, 'base64').toString('utf8').trim()
}
