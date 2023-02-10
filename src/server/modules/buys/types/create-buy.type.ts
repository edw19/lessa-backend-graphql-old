import { ObjectType, Field } from 'type-graphql'
import { Buys } from '../entities/buys.entity'
import { UpdateStockAfterBuys } from './update-stock-after-buys.type'

@ObjectType()
export class CreateBuyType {
    @Field(() => Buys)
    newBuy: Buys

    @Field(() => [UpdateStockAfterBuys])
    productsUpdated: UpdateStockAfterBuys
}
