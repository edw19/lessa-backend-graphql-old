
import { DocumentService } from 'modules/billing/services/documents.service'
import { SignDocument } from 'modules/billing/services/sign-document.service'
import { SoapService } from 'modules/billing/services/soap.service'
import { CompanyService } from "modules/companies/services/company.services";
import { ObjectId } from 'mongodb'

type GenerateElectronicInvoice = {
    company: ObjectId
    client: ObjectId
    total: number
    products: any
}

export class BillingElectronic {
    static async validateFieldsNecessayForBillingElectronic(id: ObjectId): Promise<boolean | string[]> {
        const company = await CompanyService.getCompany(id)

        const messages = [];

        if (!company?.ruc) {
            messages.push("Ruc no registrado")
        }
        if (!company?.tradename) {
            messages.push("Nombre comercial no registrado")
        }
        if (!company?.businessName) {
            messages.push("Razón social no registrada")
        }
        if (!company?.mainAddress) {
            messages.push("Dirección principal no registrada")
        }
        return messages.length > 0 ? messages : true
    }

    static async generateElectronicInvoice({ company, client, total, products }: GenerateElectronicInvoice) {
        // @ts-ignore
        console._times.clear();
        console.time(`total`);
        console.time(`generate`);
        const { xml, keyAccess } = await DocumentService.generateInvoice({
            companyId: company,
            clientId: client,
            total,
            products
        })

        const signatureInfo = await CompanyService.getSignatureInfo(company);
        SignDocument.signXml(xml, keyAccess, signatureInfo);
        console.timeEnd("generate");

        await BillingElectronic.sendVoucher(keyAccess)

        await new Promise((resolve) => {
            console.log("Esperando 3 segundos");
            return setTimeout(() => {
                console.log("termino espera");
                return resolve("");
            }, 3000);
        });

        await BillingElectronic.authorizateVoucher(keyAccess)

        await CompanyService.addNextSequential(company);
        console.timeEnd("total");
    }

    static async sendVoucher(keyAccess: string) {
        console.time(`send`);
        await SoapService.sendVoucher(keyAccess);
        console.timeEnd(`send`);
    }

    static async authorizateVoucher(keyAccess: string) {
        console.time("authorizate");
        await SoapService.authorizeVoucher(keyAccess);
        console.timeEnd("authorizate");
    }
}