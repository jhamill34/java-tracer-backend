export enum MiscAccessMask {
    OPEN = 0x0020, // module
    TRANSITIVE = 0x0020, // module requires
    STATIC_PHASE = 0x0040, // module requires
}

export enum MethodAccessMask {
    UNKNOWN = 0x6200,

    PUBLIC = 0x0001,
    PRIVATE = 0x0002,
    PROTECTED = 0x0004,
    STATIC = 0x0008,
    FINAL = 0x0010,
    SYNCHRONIZED = 0x0020,
    BRIDGE = 0x0040,
    VARARGS = 0x0080,
    NATIVE = 0x0100,
    ABSTRACT = 0x0400,
    STRICT = 0x0800,
    SYNTHETIC = 0x1000,
    MANDATED = 0x8000,
}

export function translateMethodAccess(value: number): string[] {
    const result: string[] = []
    Object.keys(MethodAccessMask).forEach((key) => {
        if ((value & MethodAccessMask[key]) > 0) {
            result.push(key)
        }
    })

    return result
}

export enum FieldAccessMask {
    UNKNOWN = 0x2f20,

    PUBLIC = 0x0001,
    PRIVATE = 0x0002,
    PROTECTED = 0x0004,
    STATIC = 0x0008,
    FINAL = 0x0010,
    VOLATILE = 0x0040,
    TRANSIENT = 0x0080,
    SYNTHETIC = 0x1000,
    ENUM = 0x4000,
    MANDATED = 0x8000,
}

export function translateFieldAccess(value: number): string[] {
    const result: string[] = []
    Object.keys(FieldAccessMask).forEach((key) => {
        if ((value & MethodAccessMask[key]) > 0) {
            result.push(key)
        }
    })

    return result
}

export enum ClassAccessMask {
    UNKNOWN = 0x08c8,

    PUBLIC = 0x0001,
    PRIVATE = 0x0002,
    PROTECTED = 0x0004,
    FINAL = 0x0010,
    SUPER = 0x0020,
    UNKNOWN4 = 0x0100,
    INTERFACE = 0x0200,
    ABSTRACT = 0x0400,
    SYNTHETIC = 0x1000,
    ANNOTATION = 0x2000,
    ENUM = 0x4000,
    MODULE = 0x8000,
}

export function translateClassAccess(value: number): string[] {
    const result: string[] = []
    Object.keys(ClassAccessMask).forEach((key) => {
        if ((value & MethodAccessMask[key]) > 0) {
            result.push(key)
        }
    })

    return result
}
