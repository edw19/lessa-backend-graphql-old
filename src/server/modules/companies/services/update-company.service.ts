import { Company, CompanyModel } from 'modules/companies/entities'
import { Types } from 'mongoose';
import { Field, InputType } from 'type-graphql';


@InputType()
export class UpdateCompanyInput {
    @Field()
    ruc: string;

    @Field({ nullable: true })
    email: string;

    @Field()
    tradename: string;

    @Field()
    businessName: string;

    @Field({ nullable: true })
    phone: string;

    @Field()
    mainAddress: string;
}

type UpdateCompany = UpdateCompanyInput & {
    company: Types.ObjectId;
}

export const updateCompany = async ({ company, ...fields }: UpdateCompany): Promise<Company | null> => {
    return await CompanyModel.findByIdAndUpdate(company, {
        $set: {
            ...fields
        }
    }, { new: true })
}