import { ObjectType, Field } from "type-graphql";
import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
})
@ObjectType()
export class AdditionalInformation {
    @Field({ nullable: true })
    id: string;

    @Field()
    @prop()
    name?: string;

    @Field()
    @prop()
    value?: string;
}