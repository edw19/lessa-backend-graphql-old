import { mongoose } from "@typegoose/typegoose";
import { Types } from "mongoose"
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class InvestmentCategory {
    @Field(() => Types.ObjectId,{ nullable: true })
    id: mongoose.Types.Types.ObjectId;

    @Field()
    name: string;

    @Field()
    countProducts: number;

    @Field()
    amount: string;
}