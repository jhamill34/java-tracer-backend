import { CallEntry, MethodEntry, InheritEntry } from 'src/models/entries'
import { GraphService } from './graph.service'
import { Injectable } from '@nestjs/common'
import { ClassRelationship } from 'src/models/graphs'
import { ClassDefinition, MethodDefinition } from 'src/models/class-definition'

const CALL_KEY = '<CALL>'
const METHOD_KEY = '<METHOD>'
const INHERIT_KEY = '<INHERIT>'

@Injectable()
export class CompileLogService {
    constructor(private readonly graphService: GraphService) {}

    extract(buffer: Buffer): void {
        buffer
            .toString()
            .split('\n')
            .forEach((line) => this.handleEntry(line))
    }

    private handleEntry(line: string): void {
        const [type, serializedEntry] = line.split(' ')

        switch (type) {
            case CALL_KEY:
                this.handleCallEntry(parseCallEntry(serializedEntry))
                break
            case METHOD_KEY:
                this.handleMethodEntry(parseMethodEntry(serializedEntry))
                break
            case INHERIT_KEY:
                this.handleInheritEntry(parseInheritanceEntry(serializedEntry))
                break
        }
    }

    private handleMethodEntry(methodEntry: MethodEntry): void {
        const methodGraph = this.graphService.getDefinedCallGraph()
        methodGraph.add(
            methodEntry.id(),
            new MethodDefinition(
                methodEntry.name,
                methodEntry.className,
                methodEntry.descriptor,
                methodEntry.modifiers,
            ),
        )

        const classGraph = this.graphService.getClassGraph()
        if (classGraph.contains(methodEntry.className)) {
            classGraph
                .getNode(methodEntry.className)
                .methods.add(methodEntry.id())
        } else {
            const classDef = new ClassDefinition(methodEntry.className)
            classDef.methods.add(methodEntry.id())
            classGraph.add(methodEntry.className, classDef)
        }
    }

    private handleCallEntry(callEntry: CallEntry): void {
        this.handleMethodEntry(callEntry.caller)
        this.handleMethodEntry(callEntry.called)

        const methodGraph = this.graphService.getDefinedCallGraph()
        methodGraph.connect(callEntry.caller.id(), callEntry.called.id(), {
            linenumber: callEntry.caller.lineNumber,
        })
    }

    private handleInheritEntry(inheritEntry: InheritEntry): void {
        const classGraph = this.graphService.getClassGraph()

        classGraph.add(
            inheritEntry.id(),
            new ClassDefinition(inheritEntry.id()),
        )

        classGraph.connect(inheritEntry.id(), inheritEntry.superClass, {
            relationship: ClassRelationship.EXTENDS,
        })
        inheritEntry.interfaces.forEach((i) => {
            classGraph.connect(inheritEntry.id(), i, {
                relationship: ClassRelationship.IMPLEMENTS,
            })
        })
    }
}

function parseMethodEntry(line: string): MethodEntry {
    const [name, descriptor, className, modifierString, lineNumberString] =
        line.split(',')

    const lineNumber = parseInt(lineNumberString)
    const modifiers =
        modifierString.trim().length === 0 ? [] : modifierString.split('|')

    return new MethodEntry(name, descriptor, className, modifiers, lineNumber)
}

function parseCallEntry(line: string): CallEntry {
    const [caller, called] = line.split('=>')

    return new CallEntry(parseMethodEntry(caller), parseMethodEntry(called))
}

function parseInheritanceEntry(line: string): InheritEntry {
    const [className, superClass, interfaceString] = line.split(',')

    const interfaces =
        interfaceString.trim().length === 0 ? [] : interfaceString.split('|')

    return new InheritEntry(className, superClass, interfaces)
}
