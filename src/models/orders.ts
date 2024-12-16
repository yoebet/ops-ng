export enum OrderTag {
  open = 'open',
  close = 'close',
  stoploss = 'stoploss',
  forceclose = 'forceclose',
}

export enum OrderStatus {
  notSummited = 'notSummited',
  summitFailed = 'summitFailed',
  pending = 'pending',
  partialFilled = 'partialFilled',
  filled = 'filled',
  canceled = 'canceled',
  expired = 'expired',
  rejected = 'rejected',
}


export function orderFinished(status: OrderStatus): boolean {
  return ![
    OrderStatus.notSummited,
    OrderStatus.pending,
    OrderStatus.partialFilled,
  ].includes(status);
}

export function orderToWait(status: OrderStatus): boolean {
  return [OrderStatus.pending, OrderStatus.partialFilled].includes(status);
}
