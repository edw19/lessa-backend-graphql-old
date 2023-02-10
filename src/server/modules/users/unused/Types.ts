import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Type for users' })
export class User {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ description: 'email from user admin' })
  email: string;

  @Field()
  pwd: string;
}

@ObjectType({ description: 'Result of login' })
export class LoginResult {
  @Field(() => String, { nullable: true })
  accessToken: string;

  @Field(() => String, { nullable: true })
  refreshToken: string;

  @Field({ nullable: true, description: 'Username of user logged' })
  username: string;


  @Field({ nullable: true, description: 'Role of user logged' })
  role: string;
}
