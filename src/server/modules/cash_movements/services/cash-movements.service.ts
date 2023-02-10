import { ObjectId } from "mongodb";
import { CashierService } from "server/modules/cashiers/services/cashier.service";
import { DatesServices } from "server/services/dates.services";
import { CashMovements, CashMovementsEntity } from "../entities/cash-movements.entity";
import { TypeCashMovementsService } from "./type-cash-movements.service";

export class CashMovementsService {
    static async getAll({ company, queryBy }: { company: ObjectId, queryBy: string }) { // should I use cashier instead of company?
        const {
            parseDateStart,
            parseDateEnd
        } = DatesServices.getDatesRange({ queryBy })
        const query = {
            company,
            createdAt: {
                $gte: parseDateStart,
                $lte: parseDateEnd,
            }
        }

        return await CashMovementsEntity.find(query).sort({ createdAt: -1 });
    }

    static async create(cashMovement: CashMovements) {
        const { typeCashMovementsId, cashMovementName, company } = cashMovement;
        let cashMovementsId;

        if (!typeCashMovementsId && cashMovementName) {
            const typeMovement = await TypeCashMovementsService.getByName({ name: cashMovementName, company, })
            cashMovementsId = typeMovement?.id;
        } else {
            cashMovementsId = typeCashMovementsId
        }
        await CashMovementsEntity.create({
            ...cashMovement,
            typeCashMovementsId: cashMovementsId,
        });
    }

    static async deleteCashMovementByTransactionId(transactionId: ObjectId) {
        return CashMovementsEntity.findOneAndDelete({ transactionId });
    }

}