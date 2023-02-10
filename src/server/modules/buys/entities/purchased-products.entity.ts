import { ObjectType, Field, InputType } from 'type-graphql'
import { prop, modelOptions } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'

@modelOptions({
  schemaOptions: {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@ObjectType()
@InputType('PurchasedProductsInput')
export class PurchasedProducts {
  @Field(() => String)
  @prop({ ref: 'products', type: ObjectId, required: true })
  product: ObjectId;

  @Field({ nullable: true })
  @prop()
  kind: string;

  @Field()
  @prop({ required: true })
  name: string;

  @Field()
  @prop({ required: true })
  units: number;

  @Field()
  @prop({ required: true })
  priceBuy: number;

  @Field({ nullable: true })
  @prop({ default: 0 })
  discountBuy: number;
}
