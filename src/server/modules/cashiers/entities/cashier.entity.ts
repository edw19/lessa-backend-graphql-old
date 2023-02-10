import { getModelForClass, ModelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

@ModelOptions({ options: { customName: "cashiers" } })
@ObjectType()
export class Cashier extends TimeStamps {
    @Field({ name: "id" })
    readonly _id?: ObjectId;

    @prop({ required: true })
    establishment: ObjectId;

    @prop({ required: true })
    cashierUserId: ObjectId;

    @Field()
    @prop({ required: true, min: 1, max: 999 })
    emissionPoint: number;

    @Field()
    @prop({ default: 0 })
    cash?: number;
}

export const CashierEntity = getModelForClass(Cashier);