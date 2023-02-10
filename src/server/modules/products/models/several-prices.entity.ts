import { prop, modelOptions } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";

@modelOptions({
    schemaOptions: {
        id: false,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
})
@ObjectType()
@InputType("SeveralPricesInput")
export class SeveralPrices {
    @Field()
    @prop()
    units: number;

    @Field()
    @prop()
    priceSale: number;
}