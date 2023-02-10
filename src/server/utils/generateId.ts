import { Types } from 'mongoose'

export const generateObjectId = (id?: any): Types.ObjectId => {

    if (id) {
        return new Types.ObjectId(id) as any
    }
    return new Types.ObjectId() as any
}