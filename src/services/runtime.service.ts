import { Injectable } from '@nestjs/common'
import { Parser } from './interfaces'

@Injectable()
export class RuntimeLogService implements Parser<void> {
    extract(buffer: Buffer): void {
        throw new Error('Method not implemented.')
    }
}
