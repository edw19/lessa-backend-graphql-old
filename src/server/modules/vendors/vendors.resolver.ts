import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'
import type { MyContext } from '../../@types/MyContext'
import { Vendor, VendorModel } from 'server/modules/vendors/vendor.entity'
import { Buys } from 'server/modules/buys/entities/buys.entity'
import { InputVendor } from './create-vendor.input'
import { VendorsService } from './vendors.services'
import { ObjectId } from 'mongodb'

@Resolver(() => Buys)
export class VendorsResolver {
  @Authorized('USER-COMPANY')
  @Query(() => [Vendor])
  async getVendors(@Ctx() { req }: MyContext) {
    return await VendorModel.find({ company: req.company!.id })
  }

  @Authorized('USER-COMPANY')
  @Mutation(() => Vendor)
  async createVendor(
    @Arg('vendor') vendor: InputVendor,
    @Ctx() { req }: MyContext
  ) {
    return await new VendorModel({
      ...vendor,
      company: req.company!.id
    }).save()
  }

  @Authorized('USER-COMPANY')
  @Mutation(() => String)
  async deleteVendor(@Arg('id', () => ObjectId) id: ObjectId) {
    return await VendorsService.deleteVender(id)
  }

  // @FieldResolver((type) => Vendor)
  // async vendor(@Root("vendor") vendor: string) {
  //   const res = await VendorModel.findById(vendor);

  //   return res;
  // }
}
