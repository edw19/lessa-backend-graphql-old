import { ObjectType, Field } from 'type-graphql'
import {
  prop,
  getModelForClass,
  modelOptions
} from '@typegoose/typegoose'
import { SoldProducts } from './sold-products.entity'
import { Types } from 'mongoose'

@modelOptions({
  options: { customName: 'sales' },
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@ObjectType()
export class Sales {
    @Field()
    id?: string;

    @prop({ ref: 'companies', required: true })
    company: Types.ObjectId;

    // @Field((type) => mongoose.Types.ObjectId, { nullable: true })
    @prop({ ref: 'clients' })
    client: Types.ObjectId | null;

    @Field()
    @prop({ default: false })
    credit: boolean;

    @Field({ nullable: true })
    @prop()
    totalSubTotalWithoutTaxation?: number;

    @Field({ nullable: true })
    @prop()
    subTotalIva?: number;

    @Field({ nullable: true })
    @prop()
    subTotalZeroPercent?: number;

    // @prop()
    // discount?: number;

    @Field({ nullable: true })
    @prop()
    totalUnits?: number;

    @Field({ nullable: true })
    @prop()
    totalIva?: number;

    @Field()
    @prop()
    total: number;

    @Field(() => [SoldProducts])
    @prop({ type: () => SoldProducts, _id: false })
    products: SoldProducts[];

    @Field()
    createdAt: Date;
}

export const SalesModel = getModelForClass(Sales)
