import { ObjectId } from 'mongodb'
import { Types } from 'mongoose'

export const generateObjectId = (id?: string | ObjectId): ObjectId => {
    return new Types.ObjectId(id ? id : undefined)
}