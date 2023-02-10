import { CompanyModel } from 'modules/companies/entities'
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  SIGNATURE_KEY_SECRET
} from 'config/variables'
import crytojs from 'crypto-js'
import { Types } from 'mongoose'

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})

interface SignatureInfo {
  companyId: Types.ObjectId;
  path: string;
  key: string;
  name: string;
  emitedDate: Date;
  expiryDate: Date;
  transmitter: string;
  owner: string;
}

export class CompanyService {
  static async createCompany(company: any) {
    try {
      // const userExist = await CompanyModel.findOne({ ruc: company?.ruc });
      // if (userExist) {
      //   throw new Error("EL RUC ya esta asociado a otra compania");
      // }

      // if (userOwner) {
      //   company.userOwner = userOwner;
      // } else {
      //   company.userOwner = company.userAdmin;
      // }

      const newCompany = await CompanyModel.create(company)
      return newCompany
    } catch (error: any) {
      throw new Error(error)
    }
  }

  static async getCompanies(userOwner: Types.ObjectId) {
    const companies = await CompanyModel.find({ userOwner })
    return companies
  }

  static async getCompany(id: Types.ObjectId) {
    const company = await CompanyModel.findById(id)
    return company
  }

  static async getTradeName(id: Types.ObjectId) {
    const company = await CompanyModel.findById(id).select('tradename -_id')
    return company?.tradename
  }

  static async getIdCompanyByUserAdmin(userAdmin: string) {
    const id = await CompanyModel.findOne({ userAdmin }).select('_id')
    return id
  }

  static async getSignatureInfo(id: Types.ObjectId): Promise<{ signatureKey: string; signaturePath: string }> {
    const result = await CompanyModel.findById(id);
    const signatureSelected = result?.signatures?.find((sign: any) => sign.selected === true)

    if (!signatureSelected) throw new Error("No has registrado una firma")

    return {
      signatureKey: signatureSelected?.key,
      signaturePath: signatureSelected?.path
    }
  }

  static async saveLogo({ companyId, secureUrl, publicId }: any) {
    const logo = await CompanyModel.findById(companyId).select(
      'logo logoPublicId -_id'
    )

    if (logo) {
      await cloudinary.uploader.destroy(logo.logoPublicId)
    }

    await CompanyModel.findByIdAndUpdate(companyId, {
      $set: { logo: secureUrl, logoPublicId: publicId }
    })
    return secureUrl
  }

  static getSequential(sequential: number): string {
    const stringSequential = String(sequential)
    const genSequential = stringSequential.padStart(9, '0')
    return genSequential
  }

  static getSerie(establishmentCode: number, emissionPoint: number): string {
    const stringEstablishmentCode = String(establishmentCode)
    const stringEmissionPoint = String(emissionPoint)
    const serie =
      stringEstablishmentCode.padStart(3, '0') +
      stringEmissionPoint.padStart(3, '0')
    return serie
  }

  static async addNextSequential(id: Types.ObjectId): Promise<void> {
    await CompanyModel.findByIdAndUpdate(id, { $inc: { sequential: 1 } })
  }

  static async updateSignaturePath(companyId: string, signaturePath: string, signatureKey: string): Promise<void> {
    signatureKey = crytojs.AES.encrypt(signatureKey, SIGNATURE_KEY_SECRET).toString()

    await CompanyModel.findByIdAndUpdate(companyId, {
      $set: { signaturePath, signatureKey }
    })
  }

  static async addNewSignature(signatureInfo: SignatureInfo) {
    let { key, companyId, path, name, emitedDate, expiryDate, transmitter, owner } = signatureInfo
    key = crytojs.AES.encrypt(key as string, SIGNATURE_KEY_SECRET).toString()

    const company = await CompanyModel.findByIdAndUpdate(companyId, {
      $push: {
        signatures: {
          name,
          key,
          path,
          emitedDate,
          expiryDate,
          transmitter,
          owner
        }
      }
    }, { new: true })

    return company
  }

  static async selectSignature(companyId: Types.ObjectId, signatureId: string) {
    try {
      const company = await CompanyModel.findById(companyId).then(comp => {
        comp?.signatures?.forEach(sig => {
          sig.selected = false
          if (sig.id === signatureId) sig.selected = true
        })

        comp?.save()
        return comp
      })

      return company
    } catch (error: any) {
      throw new Error(error)
    }
  }

  static async countCompaniesRegistered(): Promise<number> {
    const count = await CompanyModel.countDocuments({})
    return count
  }
}
