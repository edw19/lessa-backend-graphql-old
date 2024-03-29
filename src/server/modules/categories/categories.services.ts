import { Types } from "mongoose"
import { CategoriesModel } from "modules/categories/categories.model";

export class CategoriesService {
    static async getCategories(company: Types.ObjectId) {
        return await CategoriesModel.find({ company }).sort({ name: 1 });
    }

    static async verifyCategoryExists(name: string, company: Types.ObjectId) {
        const existsCategory = await CategoriesModel.findOne({
            $and: [{ company }, { name }],
        }).exec();
        if (existsCategory) return existsCategory;
        return false
    }

    static async createCategory(name: string, company: Types.ObjectId) {
        if (await this.verifyCategoryExists(name, company)) throw new Error("Categoría ya existe");
        return await new CategoriesModel({ name, company }).save();
    }

    static async deleteCategory(id: string) {
        return await CategoriesModel.findByIdAndDelete(id);
    }
}
