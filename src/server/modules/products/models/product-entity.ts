import { ObjectType, Field, Int } from "type-graphql";
import { getModelForClass, prop, modelOptions, plugin, index } from "@typegoose/typegoose";
import { Taxes } from './Taxes'
import { AdditionalInformation } from './AdditionalInformation'
import { Types } from "mongoose"
import { BasePropsEntity } from "../../base/base-props-entity";
import paginationPlugin, { PaginateModel } from 'typegoose-cursor-pagination';
import { SeveralPrices } from "./several-prices.entity";
import { ObjectIdScalar } from "server/graphql/object-id-scalar";
import { Categories } from "server/modules/categories/categories.model";

@plugin(paginationPlugin)
@index({ name: 1 })
@modelOptions({
  options: { customName: "products" },
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@ObjectType()
export class Product extends BasePropsEntity {
  @Field(() => ObjectIdScalar, { name: 'id' })
  readonly _id: Types.ObjectId;

  @prop({ required: true })
  category: Types.ObjectId;

  @Field({ nullable: true })
  @prop()
  kind: string;

  @Field()
  @prop({ required: true })
  code: string;

  @Field({ nullable: true })
  @prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @prop()
  description: string;

  @Field(() => Int, { nullable: true })
  @prop({ default: 0 })
  stock: number;

  @Field()
  @prop({ required: true })
  priceBuy: number;

  @Field()
  @prop({ required: true })
  priceSale: number;

  // @Field({ nullable: true })
  // @prop()
  // discountBuy: number; // ciertas unidades deben tener un descuento y tambien el descuento en ventas

  @Field({ nullable: true })
  @prop({ default: 0 })
  discountSale: number;

  @Field({ nullable: true })
  @prop({ default: false })
  activateDiscountSale: boolean;

  @Field()
  @prop({ type: () => Taxes })
  taxes: Taxes;

  @Field(() => [AdditionalInformation], { nullable: "itemsAndList" })
  @prop({ type: () => [AdditionalInformation] })
  additionalInformation?: AdditionalInformation[];

  @Field(() => [SeveralPrices], { nullable: "itemsAndList" })
  @prop({ type: () => SeveralPrices })
  morePrices?: SeveralPrices[];

  @Field({ nullable: true })
  @prop()
  dateExpires: Date;
}

export const ProductModel = getModelForClass(Product) as PaginateModel<Product, typeof Product>;
