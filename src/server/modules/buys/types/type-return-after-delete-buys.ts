import { Types } from "mongoose"
import { Field, ObjectType } from "type-graphql";
import { ReturnAfterDeleteBuysProducts } from './type-return-after-delete-buys-products'

@ObjectType()
export class ReturnAfterDeleteBuys {
    @Field()
    buyId: Types.ObjectId;

    @Field(type => [ReturnAfterDeleteBuysProducts])
    products: ReturnAfterDeleteBuysProducts[];
}