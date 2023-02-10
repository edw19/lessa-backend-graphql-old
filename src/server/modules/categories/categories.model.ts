import { ObjectType, Field } from "type-graphql";
import {
  getModelForClass,
  prop,
  modelOptions,
} from "@typegoose/typegoose";
import { BasePropsEntity } from "../base/base-props-entity";
import { ObjectId } from "mongodb";

@modelOptions({
  options: { customName: "categories" },
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
})
@ObjectType()
export class Categories extends BasePropsEntity {
  @Field({ name: "id" })
  readonly _id: ObjectId;

  @prop({ ref: "companies" })
  company: ObjectId;

  @Field()
  @prop({ required: true })
  name: string;
}

export const CategoriesModel = getModelForClass(Categories);
