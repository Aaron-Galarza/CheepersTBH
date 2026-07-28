import { ProductModel, IProduct } from './products.model';
import { makeCrud } from '../../utils/crudFactory';

export const ProductsService = {
  ...makeCrud(ProductModel),

  viewPublic: async (): Promise<IProduct[]> => {
    const products = await ProductModel.find({ active: true })
      .populate('category', 'name order')
      .sort({ 'category.order': 1 })
      .lean();
    return products as IProduct[];
  },
};
