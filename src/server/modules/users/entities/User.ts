import { ObjectType, Field } from "type-graphql";
import { getModelForClass, prop, mongoose, modelOptions } from "@typegoose/typegoose";
import { Types } from "mongoose"

@modelOptions({
  options: { customName: "users" },
  schemaOptions: {
    timestamps: true, versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },

})
@ObjectType()
export class User {
  @Field()
  id?: string;

  // @prop()
  // userOwner?: mongoose.Types.ObjectId;

  @Field(() => Types.ObjectId,{ nullable: true })
  @prop()
  company?: mongoose.Types.ObjectId;

  @Field(() => Types.ObjectId,{ nullable: true })
  @prop()
  establishment?: mongoose.Types.ObjectId;

  @prop()
  cashier?: mongoose.Types.ObjectId;

  @Field()
  @prop()
  username: string;

  @Field()
  @prop({ required: true })
  email?: string;

  @prop({ required: true })
  pwd: string;

  @Field(() => [String])
  @prop({ type: String })
  role: string[];

  @Field({ nullable: true })
  @prop({ default: true })
  isActive?: boolean;

  @Field({ nullable: true })
  @prop()
  multiCompanies: boolean;
}

export const UserModel = getModelForClass(User);
