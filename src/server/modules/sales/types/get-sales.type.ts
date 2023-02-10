import { ObjectId } from 'mongodb';
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class GetSalesType {
    @Field({ name: "id" })
    readonly _id: ObjectId

    @Field()
    totalSale: number;

    @Field()
    investment: number;

    @Field()
    profit: number;

    @Field()
    createdAt: Date;

    @Field()
    totalUnits: number;

    @Field()
    credit: boolean;
}