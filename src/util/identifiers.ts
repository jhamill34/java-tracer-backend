export function generateMethodId(
    className: string,
    name: string,
    descriptor: string,
    isStatic: boolean,
): string {
    return className + (isStatic ? '#' : '.') + name + descriptor
}
