import { Types } from "mongoose"
import { TypeCashMovementsEntity, TypeCashMovements } from "../entities/type-cash-movements.entity";

export class TypeCashMovementsService {
    static async getAll({ company }: { company: Types.ObjectId }) {
        return await TypeCashMovementsEntity.find({ company, showInList: true });
    }

    static async create(typeCashMovement: TypeCashMovements) {
        return await TypeCashMovementsEntity.create(typeCashMovement);
    }

    static async getOne({ id }: { id: Types.ObjectId }) {
        return await TypeCashMovementsEntity.findById(id);
    }

    static async getByName({ name, company }: { name: string, company: Types.ObjectId }) {
        return await TypeCashMovementsEntity.findOne({ name, company });
    }
}