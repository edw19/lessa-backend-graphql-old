import { Field, InputType } from "type-graphql";
import { mongoose } from "@typegoose/typegoose";
import { InputTaxes } from './input-taxes'
import { InputAdditionalInformation } from './input-additional-information'
import { SeveralPrices } from '../models/several-prices.entity'
import { Types } from "mongoose"

@InputType()
export class CreateProductInput {
    @Field()
    code: string;

    @Field({ nullable: true })
    auxiliaryCode?: string;

    @Field()
    kind: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field(() => Types.ObjectId,{ nullable: true })
    category: mongoose.Types.Types.ObjectId;

    @Field({ nullable: true })
    priceBuy: number;

    @Field()
    priceSale: number;

    @Field({ nullable: true })
    discountSale: number;

    @Field({ nullable: true })
    activateDiscountSale: boolean;

    @Field({ nullable: true })
    dateExpires?: Date;

    @Field(() => InputTaxes)
    taxes: InputTaxes;

    @Field(() => [InputAdditionalInformation], { nullable: true })
    additionalInformation?: InputAdditionalInformation[];

    @Field(() => [SeveralPrices], { nullable: true })
    morePrices?: SeveralPrices[];
}