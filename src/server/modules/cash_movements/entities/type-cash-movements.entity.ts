import { ObjectType, Field } from 'type-graphql'
import { getModelForClass, ModelOptions, prop } from "@typegoose/typegoose";
import { BasePropsEntity } from "modules/base/base-props-entity";
import { ObjectId } from "mongodb";

@ModelOptions({
    options: { customName: "typecashmovements" }
})
@ObjectType()
export class TypeCashMovements extends BasePropsEntity {
    @Field({ name: 'id' })
    readonly _id?: ObjectId

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