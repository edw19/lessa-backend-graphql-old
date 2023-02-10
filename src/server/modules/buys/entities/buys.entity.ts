import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { PurchasedProducts } from './purchased-products.entity'

@modelOptions({
  options: { customName: 'buys' },
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@ObjectType()
export class Buys {
  @Field({ nullable: true })
  id?: string;

  @prop({ required: true })
  company: Types.ObjectId;

  // @Field() EL FIELD FOR GRAPHQL BE RESOLVE IN QUERY GETbYS
  @prop({ ref: 'vendors', required: true })
  vendor: Types.ObjectId;

  @Field()
  @prop()
  totalDiscount: number

  @Field({ nullable: true })
  @prop()
  totalSubTotalWithoutTaxation: number;

  @Field({ nullable: true })
  @prop()
  subTotalIva: number;

  @Field({ nullable: true })
  @prop()
  subTotalZeroPercent: number;

  @Field({ nullable: true })
  @prop()
  totalUnits: number;

  @Field({ nullable: true })
  @prop()
  totalIva: number;

  @Field()
  @prop()
  total: number;

  @Field()
  @prop()
  credit: boolean;

  @Field({ nullable: true })
  @prop()
  paymentDate?: Date;

  @Field()
  @prop()
  description: string;

  @Field(() => [PurchasedProducts])
  @prop({ type: () => PurchasedProducts, _id: false })
  buys: PurchasedProducts[];

  @Field()
  @prop()
  createdAt: Date;
}

export const BuysModel = getModelForClass(Buys)
