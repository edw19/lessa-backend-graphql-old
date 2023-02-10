import { Types } from "mongoose";
import { Field, InputType } from "type-graphql";
import { SoldProducts } from "../entities";
// import { ProductsSaleInput } from './products-sale.input'

@InputType()
export class CreateSaleInput {
  @Field({ nullable: true })
  client: Types.ObjectId;

  @Field()
  credit: boolean;

  @Field({ nullable: true })
  amountToBePaid: number;

  @Field()
  totalSubTotalWithoutTaxation: number;

  @Field()
  subTotalIva: number;

  @Field()
  subTotalZeroPercent: number;

  // @Field()
  // discount: number;

  @Field()
  totalUnits: number;

  @Field()
  totalIva: number;

  @Field()
  total: number;

  @Field()
  createdAt: Date;

  // @Field(() => [ProductsSaleInput])
  // products: ProductsSaleInput[];

  @Field(() => [SoldProducts])
  products: SoldProducts[];

  @Field()
  electronicBilling: boolean;
}