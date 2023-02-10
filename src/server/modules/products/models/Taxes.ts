import { ObjectType, Field, InputType } from "type-graphql";
import { prop, modelOptions, } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
})
@ObjectType()
@InputType("TaxesInput")
export class Taxes {
  @Field({ nullable: true })
  id: string;

  @Field()
  @prop()
  iva: string;

  @Field({ nullable: true })
  @prop()
  ice?: string

  @Field({ nullable: true })
  @prop()
  irbpnr?: string
}