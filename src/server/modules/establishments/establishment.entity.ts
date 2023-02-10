import { ObjectType, Field } from "type-graphql";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

@ObjectType()
export class Establishment {
    @Field({ name: 'id' })
    _id: string;

    // fields for handler establishment
    @prop({ required: true })
    company: ObjectId;

    // @Field(() => [ObjectId])
    @prop({ required: true, type: () => [ObjectId] })
    admins: ObjectId[];

    @Field({ nullable: true })
    @prop()
    address: string;

    @Field({ nullable: true })
    @prop()
    phone: string;

    @Field({ nullable: true })
    @prop()
    establishmentCode: number;

    @Field({ nullable: true })
    @prop()
    emissionPoint: number;

    // voucher number
    @Field({ nullable: true })
    @prop()
    sequential: number;
}

export const EstablishmentModel = getModelForClass(Establishment)