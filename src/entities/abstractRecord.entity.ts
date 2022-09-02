import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Index,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Index(['jobToken'])
export abstract class AbstractRecord {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    createdAt: number

    @Column()
    updatedAt: number

    @Column()
    jobToken: string

    @BeforeInsert()
    setCreatedDate() {
        this.createdAt = Date.now()
        this.updatedAt = Date.now()
    }

    @BeforeUpdate()
    updateDate() {
        this.updatedAt = Date.now()
    }
}
