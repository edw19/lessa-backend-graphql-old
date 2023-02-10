import { mongoose } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class InvestmentCategory {
    @Field(() => ObjectId,{ nullable: true })
    id: mongoose.Types.ObjectId;

    @Field()
    name: string;

    @Field()
    countProducts: number;

    @Field()
    amount: string;
}