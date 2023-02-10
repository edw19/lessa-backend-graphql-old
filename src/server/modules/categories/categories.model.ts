import { ObjectType, Field } from "type-graphql";
import {
  getModelForClass,
  prop,
  modelOptions,
} from "@typegoose/typegoose";
import { BasePropsEntity } from "../base/base-props-entity";
import { Types } from "mongoose"
import { ObjectIdScalar } from "server/graphql/object-id-scalar";

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
  readonly _id: Types.ObjectId;

  @prop({ ref: "companies" })
  company: Types.ObjectId;

  @Field()
  @prop({ required: true })
  name: string;
}

export const CategoriesModel = getModelForClass(Categories);
