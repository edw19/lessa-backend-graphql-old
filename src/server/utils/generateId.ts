import { Types } from 'mongoose'
import { Types } from 'mongoose'

export const generateObjectId = (id?: any): Types.ObjectId => {

    if (id) {
        return new Types.Types.ObjectId(id) as any
    }
    return new Types.Types.ObjectId() as any
}