import { Injectable } from '@nestjs/common'
import { MethodCall } from 'src/models/class-definition'
import {
    MethodCallEntry,
    MethodCallEntryType,
    MethodEntry,
} from 'src/models/entries'
import { GraphService } from './graph.service'

const ENTER_KEY = '<ENTER>'
const EXIT_KEY = '<EXIT>'

@Injectable()
export class RuntimeLogService {
    constructor(private readonly graphService: GraphService) {}

    extract(buffer: Buffer): void {
        const threadStacks: Map<string, MethodCallEntry[]> = new Map<
            string,
            MethodCallEntry[]
        >()
        buffer
            .toString()
            .split('\n')
            .forEach((line) => this.handleEntry(line, threadStacks))
    }

    private handleEntry(
        line: string,
        threadStacks: Map<string, MethodCallEntry[]>,
    ): void {
        const [type, ...serializedEntryParts] = line.split(' ')
        const serializedEntry = serializedEntryParts.join(' ')

        switch (type) {
            case ENTER_KEY:
                this.handleEnterEntry(
                    parseEntry(MethodCallEntryType.ENTER, serializedEntry),
                    threadStacks,
                )
                break
            case EXIT_KEY:
                this.handleExitEntry(
                    parseEntry(MethodCallEntryType.EXIT, serializedEntry),
                    threadStacks,
                )
                break
        }
    }

    private handleEnterEntry(
        entry: MethodCallEntry,
        threadStacks: Map<string, MethodCallEntry[]>,
    ): void {
        if (!threadStacks.has(entry.thread)) {
            threadStacks.set(entry.thread, [])
        }

        const stack = threadStacks.get(entry.thread)
        stack.push(entry)

        const graph = this.graphService.getCallGraph()
        graph.add(
            entry.id(),
            new MethodCall(entry.method.name, entry.thread, entry.time, 0),
        )
    }

    private handleExitEntry(
        entry: MethodCallEntry,
        threadStacks: Map<string, MethodCallEntry[]>,
    ): void {
        const graph = this.graphService.getCallGraph()

        const stack = threadStacks.get(entry.thread)

        if (stack === undefined || stack.length === 0) {
            return
        }

        let top: MethodCallEntry = stack.at(-1)

        while (top.id() !== entry.id()) {
            const unknown = stack.pop()
            top = stack.at(-1)

            graph.connect(top.id(), unknown.id(), {
                duration: -1,
            })
        }

        if (top.id() === entry.id()) {
            const start = stack.pop()

            top = stack.at(-1)
            if (top !== undefined) {
                graph.connect(top.id(), entry.id(), {
                    duration: entry.time - start.time,
                })
            }
        }
    }
}

function parseEntry(type: MethodCallEntryType, line: string): MethodCallEntry {
    const [
        thread,
        timeString,
        name,
        descriptor,
        className,
        modifierString,
        lineNumberString,
    ] = line.split(',')

    const time = parseInt(timeString)
    const lineNumber = parseInt(lineNumberString)
    const modifiers =
        modifierString.trim().length === 0 ? [] : modifierString.split('|')

    return new MethodCallEntry(
        type,
        thread,
        time,
        new MethodEntry(name, descriptor, className, modifiers, lineNumber),
    )
}
