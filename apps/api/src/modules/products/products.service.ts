import { ProductModel } from './products.model';
import { makeCrud } from '../../utils/crudFactory';

export const ProductsService = {
  ...makeCrud(ProductModel),
};
