import { ObjectId } from "mongodb";
import { TypeCashMovementsEntity, TypeCashMovements } from "../entities/type-cash-movements.entity";

export class TypeCashMovementsService {
    static async getAll({ company }: { company: ObjectId }) {
        return await TypeCashMovementsEntity.find({ company, showInList: true });
    }

    static async create(typeCashMovement: TypeCashMovements) {
        return await TypeCashMovementsEntity.create(typeCashMovement);
    }

    static async getOne({ id }: { id: ObjectId }) {
        return await TypeCashMovementsEntity.findById(id);
    }

    static async getByName({ name, company }: { name: string, company: ObjectId }) {
        return await TypeCashMovementsEntity.findOne({ name, company });
    }
}