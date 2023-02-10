import { ObjectType, Field } from 'type-graphql'
import {
  prop,
  modelOptions
} from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@ObjectType()
export class Signature {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    @prop()
    name: string;

    @Field({ nullable: true })
    @prop()
    emitedDate: Date;

    @Field({ nullable: true })
    @prop()
    expiryDate: Date;

    @Field({ nullable: true })
    @prop()
    transmitter: string;

    @Field({ nullable: true })
    @prop()
    key: string;

    @Field({ nullable: true })
    @prop()
    path: string;

    @Field({ nullable: true })
    @prop()
    owner: string;

    @Field({ nullable: true })
    @prop({ default: false })
    selected: boolean;
}
