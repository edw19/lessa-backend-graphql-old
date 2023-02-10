import { ObjectType, Field, InputType } from "type-graphql";
import { prop, modelOptions } from "@typegoose/typegoose";
import { Taxes } from "modules/products/models/Taxes";
import { ObjectId } from "mongodb";

@modelOptions({
    schemaOptions: {
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
})
@ObjectType()
@InputType("SoldProductsInput")
export class SoldProducts {
    @Field(() => String)
    @prop({ required: true, ref: "products" })
    productId: ObjectId;

    @Field(() => String, { nullable: true })
    @prop({ required: true })
    code: string

    @Field()
    @prop()
    kind: string;

    @Field()
    @prop()
    units: number;

    @Field()
    @prop()
    name: string;

    @Field()
    @prop()
    priceSale: number;

    @Field()
    @prop()
    priceBuy: number;

    @Field({ nullable: true })
    @prop({ type: () => Taxes })
    taxes: Taxes;
}