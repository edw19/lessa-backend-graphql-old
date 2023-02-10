import { Field, InputType } from "type-graphql";

@InputType()
export class InputGetProductsQuery {
    @Field({ nullable: true })
    category?: string;

    @Field({ nullable: true })
    search?: string;

    @Field({ nullable: true })
    stock?: number;
}