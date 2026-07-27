import { CouponModel } from './coupons.model';
import { makeCrud } from '../../utils/crudFactory';

export const CouponService = {
  ...makeCrud(CouponModel),
};
