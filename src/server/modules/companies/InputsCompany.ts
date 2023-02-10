import { Field, InputType } from 'type-graphql'
import { MaxLength, IsString, IsEmail } from 'class-validator'

@InputType()
export class InputCreateCompany {
  @Field()
  @IsString()
  @MaxLength(100, {
    message: 'Nombre Comercial mayor a 100 caracteres'
  })
  tradename: string;

  @Field()
  @IsString()
  slogan: string

  @Field()
  @MaxLength(13, {
    message: 'Ruc consta de 13 numeros'
  })
  ruc: string;

  @Field()
  @IsEmail()
  @MaxLength(120, {
    message: 'Email no puede ser mayor a 120 caracteres'
  })
  email: string;

  @Field()
  @IsString()
  @MaxLength(100, {
    message: 'Dirección Principal mayor a 100 caracteres'
  })
  mainAddress: string;

  @Field()
  @IsString()
  @MaxLength(10, {
    message: 'Teléfono mayor a 10 caracteres'
  })
  phone: string;

  // @Field()
  // @IsString()
  // @MaxLength(300, {
  //   message: "Razón social mayor a 300 caracteres",
  // })
  // businessName: string;

  // @Field()
  // @MaxLength(2, {
  //   message: "Régimen Microempresas a 2 caracteres",
  // })
  // regimeMicroBusinesses: string;

  // @Field()
  // @MaxLength(2, {
  //   message: "Obligado a llevar Contabilidad a 2 caracteres",
  // })
  // accounting: string;

  // @Field()
  // @MaxLength(2, {
  //   message: "Agente de resolución retención mayor a 2 caracteres",
  // })
  // agentRetentionResolution: string;

  // @Field()
  // @MaxLength(7, {
  //   message: "color ride mayor a 7 caracteres",
  // })
  // colorRide: string;

  // @Field()
  // @MaxLength(2, {
  //   message: "Contribuyente especial mayor a 2 caracteres",
  // })
  // specialTaxpager: string;

  // @Field()
  // @MaxLength(10, {
  //   message: "Exportador mayor a 10 caracteres",
  // })
  // export: string;

  // @Field()
  // @MaxLength(10, {
  //   message: "Tipo Exportador mayor a 10 caracteres",
  // })
  // exportType: string;

  // @Field()
  // logo: string;
}

@InputType()
export class InputAddSignature {
  @Field()
  name: string;

  @Field({ nullable: true })
  owner: string;

  @Field()
  transmitter: string;

  @Field()
  emitedDate: Date;

  @Field()
  expiryDate: Date;

  @Field()
  key: string;

  @Field()
  path: string;
}
