import { Field, ObjectType } from "type-graphql";
import { SalesResultsFields } from './sales-results-fields.type'

@ObjectType()
export class SalesResults {
    @Field()
    dailySales: SalesResultsFields

    @Field()
    weeklySales: SalesResultsFields

    @Field()
    monthlySales: SalesResultsFields
}