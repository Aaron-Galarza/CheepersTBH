import { AdicionalModel, IAdicional } from './additionals.model';
import { makeCrud } from '../../utils/crudFactory';

export const AdditionalsService = {
  ...makeCrud(AdicionalModel),

  viewPublic: async (): Promise<IAdicional[]> => {
    return await AdicionalModel.find({ active: true }).lean();
  },
};
