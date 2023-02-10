import { ObjectType, Field } from "type-graphql";
import {
    getModelForClass,
    prop,
    modelOptions,
    mongoose,
} from "@typegoose/typegoose";
import { Types } from "mongoose"
import { CreditHistory } from './credit-history.entity'

@modelOptions({
    options: { customName: "clients" },
    schemaOptions: {
        timestamps: true, versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
})
@ObjectType()
export class Clients {
    @Field()
    id: string;

    @Field(() => Types.ObjectId, { nullable: false })
    @prop({ required: true })
    company: Types.ObjectId;

    // change name by identification
    @Field({ nullable: true })
    @prop({ required: true })
    identificationCard: string;

    @Field({ nullable: true })
    @prop({ required: false })
    identification: string;

    @Field({ nullable: true })
    @prop({ required: false })
    email: string;

    @Field()
    @prop()
    name: string;

    @Field()
    @prop()
    lastName: string;

    @Field()
    @prop()
    phone: string;

    @Field()
    @prop()
    address: string;

    @Field()
    @prop({ default: 0 })
    credit: number;

    @Field()
    @prop({ default: "05" })
    typeIdentification: string;

    @Field(() => [CreditHistory])
    @prop({ type: () => CreditHistory })
    public historyCredit?: CreditHistory[];
}

export const ClientsModel = getModelForClass(Clients);