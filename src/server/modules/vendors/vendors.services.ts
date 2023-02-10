import { VendorModel } from 'modules/vendors/vendor.entity';
import { ObjectId } from 'mongodb';

export class VendorsService {
    static async getVendorById({ id }: { id: string }) {
        const vendor = await VendorModel.findById(id)
        return vendor
    }

    static async deleteVender(id: ObjectId): Promise<ObjectId> {
        const vendor = await VendorModel.findByIdAndDelete(id)
        return vendor?.id
    }
}