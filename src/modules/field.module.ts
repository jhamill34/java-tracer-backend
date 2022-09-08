import { Module } from '@nestjs/common'
import { FieldResolver } from 'src/resolvers/field.resolver'
import { ReferenceModule } from './reference.module'

@Module({
    imports: [ReferenceModule],
    providers: [FieldResolver],
})
export class FieldModule {}
