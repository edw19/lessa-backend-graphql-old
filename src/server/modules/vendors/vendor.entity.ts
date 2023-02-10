import { ObjectType, Field } from "type-graphql";
import { getModelForClass, prop, modelOptions, mongoose } from "@typegoose/typegoose";

@modelOptions({
    options: { customName: "vendors" },
    schemaOptions: {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
})
@ObjectType()
export class Vendor {
    @Field()
    id: string;

    @prop()
    company: mongoose.Types.ObjectId;

    @Field()
    @prop()
    name: string;

    @Field()
    @prop()
    ruc: string;

    @Field()
    @prop()
    phone: string;

    @Field()
    createdAt: Date;
}

export const VendorModel = getModelForClass(Vendor);
