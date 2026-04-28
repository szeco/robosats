import { type Federation, type PublicOrder } from '../models';

const getOrderPrice = (order: PublicOrder, federation: Federation): number | null => {
  if (order.currency === null || order.coordinatorShortAlias === undefined) {
    return null;
  }

  const limitPrice = federation.getLimits(order.coordinatorShortAlias)?.[String(order.currency)]?.price;
  const premium = Number(order.premium);

  if (limitPrice === undefined || Number.isNaN(premium)) {
    return null;
  }

  return limitPrice * (1 + premium / 100);
};

export default getOrderPrice;
