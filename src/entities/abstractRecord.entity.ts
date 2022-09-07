import { Column, PrimaryColumn } from 'typeorm'

export abstract class AbstractRecord {
    @PrimaryColumn()
    id: string

    @Column({ type: 'bigint' })
    createdAt: number

    @Column()
    jobToken: string
}
