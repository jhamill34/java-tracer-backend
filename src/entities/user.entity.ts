import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string

    @Column()
    password: string

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
