export class MethodCall {
    constructor(
        readonly name: string,
        readonly thread: string,
        readonly start: number,
        readonly end: number,
    ) {}
}

export class MethodDefinition {
    constructor(
        readonly name: string,
        readonly className: string,
        readonly descriptor: string,
        readonly modifiers: string[],
    ) {}
}

export class ClassDefinition {
    constructor(
        readonly name: string,
        readonly pkg: string = '',
        readonly methods: Set<string> = new Set<string>(),
    ) {}

    toJSON(): { [key: string]: any } {
        return {
            name: this.name,
            package: this.pkg,
            methods: Array.from(this.methods),
        }
    }
}
