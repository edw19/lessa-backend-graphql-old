import { ObjectType, Field, InputType } from "type-graphql";
import { prop, modelOptions } from "@typegoose/typegoose";
import { Taxes } from "modules/products/models/Taxes";
import { Types } from "mongoose"
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
    @Field(() => Types.ObjectId)
    @prop({ required: true, ref: "products" })
    productId: Types.ObjectId;

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

    @Field(() => Taxes, { nullable: true })
    @prop({ type: () => Taxes })
    taxes: Taxes;
}