import { ObjectType, Field } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb';
import { BasePropsEntity } from 'modules/base/base-props-entity';

@ObjectType()
export class CashMovements extends BasePropsEntity {
    @Field({ name: "id" })
    readonly _id?: ObjectId;

    @prop()
    transactionId?: ObjectId;

    @Field({ nullable: true })
    cashMovementName?: string;

    @Field({ nullable: true })
    @prop()
    typeCashMovementsId?: ObjectId; // muebles de oficina | compra de algo | sueldos | pago de servicios | ariendo 

    @Field()
    @prop()
    amount: number;

    @Field({ nullable: true })
    @prop()
    description: string;

    @Field()
    @prop()
    createdAt: Date;
}

export const CashMovementsEntity = getModelForClass(CashMovements);