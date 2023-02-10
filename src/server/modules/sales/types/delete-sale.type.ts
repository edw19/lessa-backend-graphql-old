import { Field, ObjectType } from "type-graphql";
import { ProductsUpdate } from './product-update-stock.type'

@ObjectType()
export class DeleteSale {
    @Field()
    id: string

    @Field()
    currentCash: number

    @Field(() => [ProductsUpdate])
    products: ProductsUpdate[]
}