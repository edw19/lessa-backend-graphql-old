import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class UpdateStockAfterBuys {
    @Field()
    id: string;

    @Field()
    stock: number
}