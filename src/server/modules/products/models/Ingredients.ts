import { getModelForClass, prop, modelOptions, mongoose } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@modelOptions({
    options: { customName: "ingredients" },
    schemaOptions: {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
})
export class Ingredients {
    @Field()
    id: string;

    @Field()
    @prop()
    name: string
}

// work with ingredientes as units example, hamburger has 1 lechuga, 2 tomates, 1 carne, 2 panes.