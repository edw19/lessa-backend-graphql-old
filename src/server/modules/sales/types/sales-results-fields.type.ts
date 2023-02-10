import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class SalesResultsFields {
    @Field()
    id: string

    @Field()
    total: number

    @Field()
    salesCount: number
}
