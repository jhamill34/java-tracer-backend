import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryColumn,
} from 'typeorm'

@Entity()
export class JobEntity {
    static MODEL_NAME = 'job_entity'

    @PrimaryColumn()
    token: string

    @Column()
    status: string

    @Column({ nullable: true })
    error: string

    @Column({ type: 'bigint' })
    createdAt: number

    @Column({ type: 'bigint' })
    updatedAt: number

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
