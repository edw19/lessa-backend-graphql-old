import { Field, ObjectType } from "type-graphql";


@ObjectType()
export class TypeResultBuys {
    @Field()
    buys: number;

    @Field()
    total: number;
}

@ObjectType()
export class BuysResults {
    @Field()
    dailyBuys: TypeResultBuys;

    @Field()
    weeklyBuys: TypeResultBuys;

    @Field()
    monthlyBuys: TypeResultBuys;
}