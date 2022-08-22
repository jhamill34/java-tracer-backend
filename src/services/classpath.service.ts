import { Injectable } from '@nestjs/common'
import AdmZip from 'adm-zip'
import { GraphService } from './graph.service'

@Injectable()
export class ClasspathService {
    constructor(private readonly graphService: GraphService) {}

    extract(name: string, buffer: Buffer): void {
        if (!name.endsWith('.jar')) {
            return
        }

        const packageName = name.replace('.jar', '')
        const packageService = this.graphService.getPackageGraph()
        const zip = new AdmZip(buffer)

        zip.getEntries().forEach((entry) => {
            let entryName = entry.rawEntryName.toString()
            if (!entry.isDirectory && entryName.endsWith('.class')) {
                entryName = entryName.replace('.class', '')
                packageService.add(entryName, packageName)
            }
        })
    }
}
