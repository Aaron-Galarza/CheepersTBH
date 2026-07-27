import { AdicionalModel } from './additionals.model';
import { makeCrud } from '../../utils/crudFactory';

export const AdicionalService = {
  ...makeCrud(AdicionalModel),
};
