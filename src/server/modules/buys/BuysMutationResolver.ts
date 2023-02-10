import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'
import type { MyContext } from '../../@types/MyContext'
import { CreateBuysInput } from './inputs'
import { ReturnAfterDeleteBuys } from './types'
import { BuysService } from 'modules/buys/services/buys.services'
import { CreateBuyType } from './types/create-buy.type'
import { Types } from 'mongoose'
@Resolver()
export class BuysMutationResolver {
  @Authorized('USER-COMPANY')
  @Mutation(() => CreateBuyType, { nullable: true })
  async createBuy(@Arg('buy') buy: CreateBuysInput, @Ctx() { req }: MyContext) {
    return await BuysService.createBuyService({ ...buy, company: req.company.id })
  }

  @Authorized('USER-COMPANY')
  @Mutation(() => ReturnAfterDeleteBuys)
  async deleteBuy(@Arg('id') id: Types.ObjectId) {
    return await BuysService.deleteBuyService(id)
  }

  @Authorized('USER-COMPANY')
  @Mutation(() => Types.ObjectId)
  async payCreditBuy(@Arg('id') id: Types.ObjectId) {
    await BuysService.payCreditBuy(id)
    return id
  }
}
