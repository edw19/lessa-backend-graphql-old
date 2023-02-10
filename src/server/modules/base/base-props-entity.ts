import { prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectId } from 'mongodb';

export class BasePropsEntity extends TimeStamps {
    @prop()
    company: ObjectId;

    @prop()
    establishment: ObjectId;

    // cashier: string;  should be ObjectId | string | number  with value 001

}
