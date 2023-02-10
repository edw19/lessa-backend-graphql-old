import { Types } from 'mongoose';
import { EstablishmentModel } from './establishment.entity';

type CreateEstablishment = {
    companyId: Types.ObjectId;
    userAdmin: Types.ObjectId;
    address?: string;
    phone?: string;
};

export class EstablishmentService {
    static async create({ userAdmin, companyId, ...establishment }: CreateEstablishment) {
        try {
            const countEstablishments = await EstablishmentModel.countDocuments({
                company: companyId
            });
            return await EstablishmentModel.create({
                admins: [userAdmin],
                establishmentCode: countEstablishments + 1,
                emissionPoint: 1, // i think that this field should be a entity
                company: companyId,
                sequential: 1,
                ...establishment
            });
        } catch (error: any) {
            throw new Error(error);
        }
    }

    static async getEstablishments(company: Types.ObjectId) {
        return await EstablishmentModel.find({ company });
    }

    static async getMainEstablishment(companyId: Types.ObjectId) {
        const establishment = await EstablishmentModel.findOne({ company: companyId, establishmentCode: 1 });
        return establishment;
    }
}
