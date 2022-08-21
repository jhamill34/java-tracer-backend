export interface Identifiable {
    id(): string
}

export class CallEntry {
    constructor(readonly caller: MethodEntry, readonly called: MethodEntry) {}
}

export class MethodEntry implements Identifiable {
    constructor(
        readonly name: string,
        readonly descriptor: string,
        readonly className: string,
        readonly modifiers: string[],
        readonly lineNumber: number,
    ) {}
    id(): string {
        let id = this.className
        if (this.modifiers.includes('static')) {
            id += '#'
        } else {
            id += '.'
        }

        id += this.name + this.descriptor

        return id
    }
}

export class InheritEntry implements Identifiable {
    constructor(
        readonly className: string,
        readonly superClass: string,
        readonly interfaces: string[],
    ) {}

    id(): string {
        return this.className
    }
}
