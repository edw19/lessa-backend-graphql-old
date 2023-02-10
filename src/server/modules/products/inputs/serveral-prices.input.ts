import { Field, InputType } from "type-graphql";

@InputType()
export class ServeralPrices {
    @Field()
    units: number;

    @Field()
    priceSale: number;
}