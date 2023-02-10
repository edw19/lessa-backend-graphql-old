import { Buys, BuysModel } from '../entities/buys.entity'
import { generateObjectId } from 'server/utils/generateId'
import { DatesServices } from '../../../services/dates.services'
import { ObjectId } from 'mongodb'
import { mongoose } from '@typegoose/typegoose'
import { ProductMutationService } from 'server/modules/products/services/products-mutations.service'
import { ProductsQueryService } from 'server/modules/products/services/products-queries.services'

type BuysParams = {
  company: ObjectId;
  queryBy: string;
  startDate: Date;
  endDate: Date;
  vendor: string;
  credit: boolean;
}

export class BuysService {
  static async createBuy(buy: Buys) {
    const some = buy.buys.some((product) => product.kind.includes('CommonProduct'))

    if (some) {
      buy.buys = buy.buys.map((product) => {
        const commonProduct = product.kind.includes('CommonProduct')
        return {
          ...product,
          product: commonProduct ? generateObjectId() : product.product
        }
      })
    }

    try {
      return await BuysModel.create(buy)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  static async createBuyService(buy: Buys) {
    const newBuy = await BuysService.createBuy(buy)
    const productsUpdated: any[] = []
    for (const product of buy.buys) {
      if (product.kind.includes('CommonProduct')) continue
      const productUpdated = await ProductMutationService.updateStock(product.product, product.units, 'add')
      productsUpdated.push(productUpdated)
    }
    return { newBuy, productsUpdated }
  }

  static async getBuy(id: ObjectId) {
    return await BuysModel.findById(id)
  }

  static async getBuys({ company, queryBy, startDate, endDate, vendor, credit }: BuysParams) {
    const { parseDateStart, parseDateEnd } = DatesServices.getDatesRange({ queryBy, startDate, endDate })
    const options: any = {
      company,
      createdAt: {
        $gte: parseDateStart,
        $lte: parseDateEnd
      }
    }
    if (credit) {
      options.credit = credit
    }
    if (vendor) {
      options.vendor = vendor
    }

    return await BuysModel
      .find(options)
      .sort({ createdAt: -1 })
      .select('vendor totalUnits total credit description createdAt paymentDate')
  }

  // unused
  static async getCountBuys({ company, queryBy }: any) {
    const { parseDateStart, parseDateEnd } = DatesServices.getDatesRange({ queryBy })
    return await BuysModel.find({
      company,
      createdAt: {
        $gte: parseDateStart,
        $lte: parseDateEnd
      }
    }).countDocuments()
  }

  static async getTotalBuysAndCount({ company, queryBy }: any) {
    const { parseDateStart, parseDateEnd } = DatesServices.getDatesRange({ queryBy })
    const result = await BuysModel.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(company),
          createdAt: {
            $gte: parseDateStart,
            $lte: parseDateEnd
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          buysCount: { $sum: 1 }
        }
      }
    ])

    const buys = result[0]?.buysCount || 0
    const total = +Number(result[0]?.total).toFixed(2) || 0

    return { buys, total }
  }

  static async deleteBuy(id: ObjectId) {
    await BuysModel.findByIdAndDelete(id);
  }

  static async deleteBuyService(id: ObjectId) {
    try {
      const currentBuy = await BuysService.getBuy(id)
      if (!currentBuy) throw new Error('No se encontro la compra')

      const productsUpdated: any[] = []

      for (const product of currentBuy.buys) {
        const productExists = await ProductsQueryService.getProduct(product.product)
        if (!productExists) continue
        const productUpdated = await ProductMutationService.updateStock(product.product, product.units, 'substract')
        productsUpdated.push(productUpdated)
      }

      await BuysService.deleteBuy(id)

      return {
        buyId: id,
        products: productsUpdated,
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  static async payCreditBuy(id: ObjectId) {
    await BuysModel.findByIdAndUpdate(id, {
      $set: { credit: false }
    })
  }
}
