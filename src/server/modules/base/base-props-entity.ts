import { prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export class BasePropsEntity extends TimeStamps {
    @prop()
    company: Types.ObjectId;

    @prop()
    establishment: Types.ObjectId;

    // cashier: string;  should be Types.ObjectId | string | number  with value 001

}
