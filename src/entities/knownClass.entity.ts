import { ChildEntity, Column, Index, OneToMany } from 'typeorm'
import { AbstractClassEntity } from './abstractClass.entity'
import { ExtendsEntity } from './closures/extends.entity'
import { ImplementsEntity } from './closures/implements.entity'
import { FieldEntity } from './field.entity'
import { MethodEntity } from './method.entity'

@ChildEntity()
@Index(['packageName'])
export class KnownClassEntity extends AbstractClassEntity {
    @Column()
    hash: string

    @Column({ name: 'package' })
    packageName: string

    @Column({
        nullable: true,
    })
    signature?: string

    @Column('simple-array')
    modifiers: string[]

    @OneToMany(() => MethodEntity, (method) => method.class, {
        createForeignKeyConstraints: false,
    })
    methods: MethodEntity[]

    @OneToMany(() => FieldEntity, (field) => field.class, {
        createForeignKeyConstraints: false,
    })
    fields: FieldEntity[]

    @OneToMany(() => ExtendsEntity, (klass) => klass.child, {
        createForeignKeyConstraints: false,
    })
    superClasses: ExtendsEntity[]

    @OneToMany(() => ExtendsEntity, (klass) => klass.ancestor, {
        createForeignKeyConstraints: false,
    })
    subClasses: ExtendsEntity[]

    @OneToMany(() => ImplementsEntity, (klass) => klass.child, {
        createForeignKeyConstraints: false,
    })
    interfaces: ImplementsEntity[]

    @OneToMany(() => ImplementsEntity, (klass) => klass.ancestor, {
        createForeignKeyConstraints: false,
    })
    implementors: ImplementsEntity[]
}
