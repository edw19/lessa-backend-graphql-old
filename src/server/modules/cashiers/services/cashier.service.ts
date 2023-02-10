import { ObjectId } from "mongodb";
import { TypeCashMovementsService } from "server/modules/cash_movements/services/type-cash-movements.service";
import { Cashier, CashierEntity } from "../entities/cashier.entity";

export class CashierService {
    static async getOne(id: ObjectId) {
        return await CashierEntity.findById(id);
    }

    static getALl(establishment: ObjectId) {
        return CashierEntity.find({ establishment });
    }

    static async getCashierByUserId(userId: ObjectId) {
        return await CashierEntity.findOne({ cashierUserId: userId });
    }

    static async create(cashier: Cashier) {
        await CashierEntity.create(cashier);
    }

    static async updateCash(
        { cashierId, amount, typeCashMovementsId, cashMovementName, company }:
            {
                typeCashMovementsId?: ObjectId;
                company: ObjectId;
                cashMovementName?: string;
                cashierId: ObjectId;
                amount: number;
            }) {
        let typeMovement;

        if (!typeCashMovementsId) {
            typeMovement = await TypeCashMovementsService.getByName({ name: cashMovementName!, company, })
        } else {
            typeMovement = await TypeCashMovementsService.getOne({ id: typeCashMovementsId })
        }
        const cash = typeMovement?.isExpense ? -amount : amount;
        const newCash = await CashierEntity.findByIdAndUpdate({ _id: cashierId }, { $inc: { cash } }, { new: true });
        return newCash?.cash;
    }
}