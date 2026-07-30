import { ProductModel, IProduct } from './products.model';
import { makeCrud } from '../../utils/crudFactory';

export const ProductsService = {
  ...makeCrud(ProductModel),

  viewPublic: async (): Promise<IProduct[]> => {
    const products = await ProductModel.find({ active: true })
      .populate('category', 'name order')
      .sort({ 'category.order': 1, order: 1 })
      .lean();
    return products as IProduct[];
  },

  viewAll: async (includeInactive = false): Promise<IProduct[]> => {
    const filter = includeInactive ? {} : { active: true };
    return await ProductModel.find(filter)
      .populate('category', 'name order')
      .sort({ 'category.order': 1, order: 1 });
  },

  viewById: async (id: string): Promise<IProduct | null> => {
    return await ProductModel.findById(id).populate('category');
  },

  modify: async (id: string, updateData: Partial<IProduct>): Promise<IProduct | null> => {
    return await ProductModel.findByIdAndUpdate(id, updateData, { new: true }).populate('category');
  },
};
