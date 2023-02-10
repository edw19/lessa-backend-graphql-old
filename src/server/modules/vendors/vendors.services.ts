import { VendorModel } from 'modules/vendors/vendor.entity';
import { Types } from 'mongoose';

export class VendorsService {
    static async getVendorById({ id }: { id: string }) {
        const vendor = await VendorModel.findById(id)
        return vendor
    }

    static async deleteVender(id: Types.ObjectId): Promise<Types.ObjectId> {
        const vendor = await VendorModel.findByIdAndDelete(id)
        return vendor?.id
    }
}