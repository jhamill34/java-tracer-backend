import { generateMethodId } from 'src/util/identifiers'

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
        return generateMethodId(
            this.className,
            this.name,
            this.descriptor,
            this.modifiers.includes('static'),
        )
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

export enum MethodCallEntryType {
    ENTER,
    EXIT,
}

export class MethodCallEntry implements Identifiable {
    constructor(
        readonly type: MethodCallEntryType,
        readonly thread: string,
        readonly time: number,
        readonly method: MethodEntry,
    ) {}

    id(): string {
        return '[' + this.thread + ']' + this.method.id()
    }
}
