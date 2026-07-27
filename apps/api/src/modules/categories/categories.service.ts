import { CategoriaModel } from './categories.model';
import { makeCrud } from '../../utils/crudFactory';

export const CategoriaService = {
  ...makeCrud(CategoriaModel),
};
