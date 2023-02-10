import { CompanyService } from "server/modules/companies/services/company.services";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { InputAddSignature, InputCreateCompany } from "../InputsCompany";
import { Company } from "modules/companies/entities";
import type { MyContext } from "server/@types/MyContext";
import { updateCompany, UpdateCompanyInput } from "../services/update-company.service";

@Resolver()
export class CompanyMutationResolvers {
    @Mutation(() => Boolean)
    async uploadElectronicSignature() {
        return true;
    }

    @Mutation(() => String, { nullable: true })
    async createCompany(
        @Arg("company") company: InputCreateCompany,
    ) {
        const newCompany = await CompanyService.createCompany(company);
        return newCompany;
    }

    @Mutation(() => Company)
    async updateCompany(
        @Arg("company") company: UpdateCompanyInput,
        @Ctx() { req }: MyContext
    ) {
        return await updateCompany({ ...company, company: req.company.id })
    }

    // @Authorized("USER-OWNER")
    @Mutation(() => Company, { nullable: true })
    async selectSignature(
        @Arg("signatureId") signatureId: string,
        @Ctx() { req }: MyContext
    ) {
        const result = await CompanyService.selectSignature(req.company.id, signatureId);
        return result
    }

    // @Authorized("USER-OWNER")
    @Mutation(() => Company)
    async addSignature(
        @Arg("signature") signature: InputAddSignature,
        @Ctx() { req }: MyContext
    ) {
        const companyId = req.company?.id;
        const updatedCompany = await CompanyService.addNewSignature({ ...signature, companyId })

        return updatedCompany;
    }
}