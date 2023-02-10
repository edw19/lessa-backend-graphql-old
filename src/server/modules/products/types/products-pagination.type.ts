import { Field, ObjectType } from "type-graphql";
import { Product } from "../models/product-entity";
import { Pagination } from "./pagination.type";

@ObjectType()
export class ProductsPagination extends Pagination {
    @Field(() => [Product], { nullable: true })
    docs: Product[];
}