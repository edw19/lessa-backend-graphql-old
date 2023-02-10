import { Field, InputType } from 'type-graphql';
import { MaxLength, Length } from 'class-validator';

@InputType()
export class UserRegisterInput {
    @Field()
    @MaxLength(30)
    tradename: string;

    @Field({ nullable: true })
    @MaxLength(30)
    username: string;

    @Field()
    @MaxLength(100)
    email: string;

    @Field()
    @Length(6, 20, {
        message: 'la longitud de la contraseña debe estar entre 6 a 20 caracteres'
    })
    pwd: string;
}