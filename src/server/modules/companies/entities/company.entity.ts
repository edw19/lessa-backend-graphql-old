import { ObjectType, Field } from "type-graphql";
import {
  getModelForClass,
  prop,
  modelOptions,
  mongoose,
  defaultClasses,
} from "@typegoose/typegoose";
import { Signature } from "./signature.entity";
import { ObjectId } from "mongodb";

@modelOptions({
  options: { customName: "companies" },
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
})
@ObjectType()
export class Company extends defaultClasses.TimeStamps {
  @Field({ nullable: true })
  id: string;

  @Field(() => ObjectId,{ nullable: true })
  @prop({ required: true })
  userOwner: mongoose.Types.ObjectId;

  @Field(() => ObjectId,{ nullable: true })
  @prop()
  userAdmin: mongoose.Types.ObjectId;

  @Field({ nullable: true })
  @prop()
  email: string;

  @Field({ nullable: true })
  @prop()
  ruc: string;

  @Field({ nullable: true })
  @prop({ required: false })
  businessName: string;

  @Field({ nullable: true })
  @prop()
  tradename: string;

  @Field({ nullable: true })
  @prop()
  phone: string;

  @Field({ nullable: true })
  @prop()
  mainAddress: string;

  @Field({ nullable: true })
  @prop({ required: false })
  slogan: string


  @Field({ nullable: true })
  @prop({ required: false, default: "No" })
  regimeMicroBusinesses: string;

  @Field({ nullable: true })
  @prop({ required: false, default: "No" })
  accounting: string;

  @Field({ nullable: true })
  @prop({ required: false })
  agentRetentionResolution: string;

  @Field({ nullable: true })
  @prop({ required: false })
  colorRide: string;

  @Field({ nullable: true })
  @prop({ required: false, })
  specialTaxpager: string;

  @Field({ nullable: true })
  @prop({ required: false })
  exportT: string;

  @Field({ nullable: true })
  @prop({ required: false })
  exportType: string;

  @Field({ nullable: true })
  @prop({ default: null, required: false })
  logo: string;

  @Field({ nullable: true })
  @prop({ default: null, required: false })
  logoPublicId: string;

  @prop({ default: 1 })
  establishmentCode: number;

  @prop({ default: 1 })
  emissionPoint: number;

  @prop({ default: 1 })
  sequential: number;

  @Field()
  createdAt: Date;

  @Field(() => [Signature])
  @prop({ type: () => Signature })
  signatures?: Signature[];
}

export const CompanyModel = getModelForClass(Company);
