import { Field, InputType } from 'type-graphql';
import { MaxLength, Length } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class InputUserLogin {
  @Field()
  @MaxLength(100)
  email: string;

  @Field()
  @Length(3, 20)
  pwd: string;
}



@InputType()
export class InputUserCompany {
  @Field()
  @MaxLength(100)
  email: string;

  @Field()
  @Length(6, 20, {
    message: 'la longitud de la contraseña debe estar entre 6 a 20 caracteres'
  })
  pwd: string;

  @Field()
  company: Types.ObjectId;
}

@InputType()
export class InputUserEstablishment {
  @Field()
  @MaxLength(100)
  email: string;

  @Field()
  @Length(6, 20, {
    message: 'la longitud de la contraseña debe estar entre 6 a 20 caracteres'
  })
  pwd: string;
}
