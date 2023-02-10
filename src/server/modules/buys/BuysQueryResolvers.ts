import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import type { MyContext } from 'types/MyContext'
import { InputGetBuys } from './inputs'
import { Buys } from 'modules/buys/entities/buys.entity'
import { BuysService } from 'modules/buys/services/buys.services'
import { Vendor } from 'modules/vendors/vendor.entity'
import { VendorsService } from 'modules/vendors/vendors.services'
import { BuysResults } from './types'
import { Types } from 'mongoose'

@Resolver(() => Buys)
export class BuysQueryResolver {
  @Authorized('USER-COMPANY')
  @Query(() => [Buys])
  async getBuys (
    @Arg('input') { queryBy, startDate, endDate, vendor, credit }: InputGetBuys,
    @Ctx() { req }: MyContext
  ) {
    return await BuysService.getBuys({
      company: req.company.id, queryBy, startDate, endDate, vendor, credit
    })
  }

  @Authorized('USER-COMPANY')
  @Query(() => BuysResults)
  async getBuysResults (@Ctx() { req }: MyContext) {
    const company = req.company.id
    return {
      dailyBuys: await BuysService.getTotalBuysAndCount({ company, queryBy: 'daily' }),
      weeklyBuys: await BuysService.getTotalBuysAndCount({ company, queryBy: 'weekly' }),
      monthlyBuys: await BuysService.getTotalBuysAndCount({ company, queryBy: 'monthly' })
    }
  }

  @Query(() => Buys)
  async getBuy (
    @Arg('id') id: Types.ObjectId
  ) {
    return await BuysService.getBuy(id)
  }

  @FieldResolver(() => Vendor)
  async vendor (@Root() { vendor }: any) {
    return await VendorsService.getVendorById({ id: vendor })
  }
}
