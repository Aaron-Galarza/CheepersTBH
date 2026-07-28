import { CouponModel, ICoupon } from './coupons.model';
import { makeCrud } from '../../utils/crudFactory';

export const CouponsService = {
  ...makeCrud(CouponModel),

  validateCoupon: async (code: string, paymentMethod?: string): Promise<ICoupon> => {
    const coupon = await CouponModel.findOne({
      code: code.toUpperCase(),
      active: true,
    }).lean();

    if (!coupon) {
      throw new Error('Cupón no válido');
    }

    if (coupon.validDays && coupon.validDays.length > 0) {
      const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = DAYS[new Date().getDay()];
      if (!coupon.validDays.includes(today)) {
        throw new Error('Este cupón no es válido hoy');
      }
    }

    if (coupon.validPaymentMethods && coupon.validPaymentMethods.length > 0) {
      if (!paymentMethod || !coupon.validPaymentMethods.includes(paymentMethod)) {
        throw new Error('Este cupón no aplica con el método de pago seleccionado');
      }
    }

    return coupon as ICoupon;
  },
};
