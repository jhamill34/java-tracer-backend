import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class JobEntity {
    static MODEL_NAME = 'job_entity'

    @PrimaryColumn()
    token: string

    @Column()
    status: string

    @Column()
    requested: number

    @Column({ nullable: true })
    started: number

    @Column({ nullable: true })
    completed: number

    @Column({ nullable: true })
    error: string
}
