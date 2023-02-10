import { Field, InputType } from "type-graphql";
import { InputTaxes } from './input-taxes'
import { InputAdditionalInformation } from './input-additional-information'
import { ObjectId } from "mongodb";
import { SeveralPrices } from "../models/several-prices.entity";

@InputType()
export class UpdateProductInput {
    @Field()
    id: string;

    @Field()
    kind: string;

    @Field()
    category: ObjectId

    @Field()
    code: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field()
    priceBuy: number;

    @Field()
    priceSale: number;

    @Field({ nullable: true })
    dateExpires: Date;

    @Field(() => InputTaxes)
    taxes: InputTaxes;

    @Field(() => [InputAdditionalInformation], { nullable: true })
    additionalInformation?: InputAdditionalInformation[];

    @Field(() => [SeveralPrices], { nullable: true })
    morePrices: SeveralPrices[]
}