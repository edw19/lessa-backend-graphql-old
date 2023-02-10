import fs from 'fs'
import path from 'path'
import formidable from 'formidable'
import forge from 'node-forge'
import { createConnection } from '../../utils/createConnection'
import { CompanyModel } from '../../modules/companies/entities/company.entity'
// import { getToken } from 'next-auth/jwt'
import { Types } from 'mongoose'

export const saveSign = async (req: any, res: any) => {
  if (Object.keys(req.cookies).length === 0) {
    const cookies = JSON.parse(req.headers.cookie!)
    req.cookies = cookies
  }

  // const token = await getToken({ req, secret: 'my-super-secret-key' })

  // if (token) {
  //   await createConnection()
  //   const userId: any = token.sub
  //   const company = await CompanyModel.findOne({ userOwner: userId })

  //   if (userId && company) {
  //     req.user = { id: userId }
  //     req.company = { id: company.id }
  //   }
  // }

  const formi = new formidable.IncomingForm()
  formi.parse(req, async (err: any, fields: any, files: any) => {
    try {
      const companyId = req.company?.id

      // const companyId = '615673be5b60f3429cc320ff';

      const { signatureKey, action } = fields

      const signaturePath = await uploadSignatureFile(files, companyId) as string
      const signatureInfo = await verifySignatureKey(signaturePath, signatureKey as string)

      if (action === 'verify') removeSignature(signaturePath)

      res.status(200).send({ signaturePath, signatureInfo })
      res.end()
    } catch (error: any) {
      res.status(400).send({ message: error.message })
      res.end()
    }
  })
}

function uploadSignatureFile (files: any, companyId: Types.ObjectId): Promise<any> {
  return new Promise((resolve, reject) => {
    const splitFile: [string] = files.signature.name.split('.')
    const fileExt = splitFile[splitFile.length - 1]

    const rebuiltFile = `${new Date().getTime()}.${fileExt}`

    const pathCompany = createPathUploads(companyId)
    const oldPath = files.signature.path
    const newPath = `${pathCompany}/${rebuiltFile}`

    fs.copyFile(oldPath, newPath, function (err) {
      if (err) {
        console.log({ err })
        reject(err)
      } else {
        resolve(newPath)
      }
    })
  })
}

function createPathUploads (companyId: Types.ObjectId): string {
  const pathCompany = path.resolve(
    __dirname,
    `../../../../../src/server/services/signature/uploads/${companyId}`
  )

  const exists = fs.existsSync(pathCompany)

  if (!exists) {
    fs.mkdirSync(pathCompany, { recursive: true })
  }

  return pathCompany
}

function verifySignatureKey (signaturePath: string, signatureKey: string) {
  return new Promise((resolve, reject) => {
    try {
      const signature = fs.readFileSync(signaturePath)
      const arrayUint8 = new Uint8Array(signature)
      const p12B64 = forge.util.binary.base64.encode(arrayUint8)
      const p12Der = forge.util.decode64(p12B64)
      const p12Asn1 = forge.asn1.fromDer(p12Der)
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, signatureKey)
      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
      const cert = certBags[forge.pki.oids.certBag]![1].cert

      const signatureInfo = {
        emitedDate: cert?.validity.notBefore,
        expiryDate: cert?.validity.notAfter,
        transmitter: cert?.issuer.getField('O').value,
        owner: cert?.subject.attributes[5].value
      }

      resolve(signatureInfo)
    } catch (error) {
      console.log({ error })

      removeSignature(signaturePath)
      reject(new Error('Clave inválida'))
    }
  })
}

function removeSignature (path: string) {
  fs.unlink(path, (fileError) => {
    if (fileError) throw fileError
    console.log(`${path} was deleted`)
  })
}
