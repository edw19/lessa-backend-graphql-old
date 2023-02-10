import { ObjectId } from 'mongodb'
import { Types } from 'mongoose'

export const generateObjectId = (id?: any): ObjectId => {

    if (id) {
        return new Types.ObjectId(id) as any
    }
    return new Types.ObjectId() as any
}