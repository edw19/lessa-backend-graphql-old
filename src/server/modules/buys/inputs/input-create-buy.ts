import { Types } from 'mongoose'
import { Field, InputType } from 'type-graphql'
import { PurchasedProducts } from '../entities/purchased-products.entity'
// import { InputProductsBuys } from './input-products-buys'

@InputType()
export class CreateBuysInput {
    @Field()
    vendor: Types.ObjectId;

    @Field()
    totalSubTotalWithoutTaxation: number;

    @Field()
    subTotalIva: number;

    @Field()
    subTotalZeroPercent: number;

    @Field()
    totalUnits: number;

    @Field()
    totalDiscount: number;

    @Field()
    totalIva: number;

    @Field()
    total: number;

    @Field()
    credit: boolean;

    @Field({ nullable: true })
    description: string;

    @Field(() => [PurchasedProducts])
    buys: PurchasedProducts[];

    @Field({ nullable: true })
    paymentDate?: Date;

    @Field()
    createdAt: Date;
}
