import {
    ArgsType,
    Field,
    InputType,
    ObjectType,
    PickType,
} from '@nestjs/graphql'
import { Paginated, PaginationArgs } from 'src/util/paginationUtil'

@ObjectType()
export class ClassModel {
    @Field()
    id: string

    @Field()
    name: string

    @Field({ nullable: true })
    hash?: string

    @Field({ nullable: true })
    packageName?: string

    @Field({ nullable: true })
    signature?: string

    @Field(() => [String], { nullable: true })
    modifiers?: string[]
}

@ObjectType()
export class ClassModelConnection extends Paginated(ClassModel) {}

@InputType()
export class ClassModelFilterInput extends PickType(
    ClassModel,
    ['name', 'packageName'],
    InputType,
) {}

@ArgsType()
export class ClassModelFilter extends PaginationArgs {
    @Field(() => ClassModelFilterInput, { nullable: true })
    filter?: ClassModelFilterInput
}
