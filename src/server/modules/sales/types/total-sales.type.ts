import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class TotalSales {
    @Field()
    sales: number

    @Field()
    investment: number

    @Field()
    total: number

    @Field()
    subTotal: number

    @Field()
    iva: number

    @Field()
    profit: number
}