import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, ModelOptions, prop } from "@typegoose/typegoose";
import { BasePropsEntity } from "modules/base/base-props-entity";
import { Types } from "mongoose"

@ModelOptions({
    options: { customName: "typecashmovements" }
})
@ObjectType()
export class TypeCashMovements extends BasePropsEntity {
    @Field({ name: 'id' })
    readonly _id?: Types.ObjectId

    @Field()
    @prop()
    name: string;

    @Field()
    @prop()
    isExpense: boolean;

    @prop({ default: true })
    showInList?: boolean;
}

export const TypeCashMovementsEntity = getModelForClass(TypeCashMovements);