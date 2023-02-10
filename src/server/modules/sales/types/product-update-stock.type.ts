import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export class ReturnCreateSale {
    @Field()
    saleId: string;

    @Field(() => [ProductsUpdate])
    products: ProductsUpdate[]

}

@ObjectType()
export class ProductsUpdate {
    @Field()
    id: string;

    @Field(() => Int)
    stock: number;
}