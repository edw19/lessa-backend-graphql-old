import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PercentageSalesCredit {
    @Field()
    totalSales: number
    @Field()
    totalSalesWithoutCredit: number
    @Field()
    percentageSalesWithoutCredit: number
    @Field()
    totalSalesCredit: number
    @Field()
    percentageSalesCredit: number
}