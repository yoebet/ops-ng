import { OrderStatus, OrderTag } from '@/models/orders';
import { TradeSide } from '@/models/base';


export class StrategyOrder {

  dealId?: number;

  tag?: OrderTag;

  side: TradeSide;

  status: OrderStatus;

  clientOrderId?: string;

  priceType: 'market' | 'limit';

  limitPrice?: number;

  baseSize?: number;

  quoteAmount?: number;

  algoOrder: boolean;

  tpslType?: 'tp' | 'sl' | 'tpsl' | 'move';

  // ---

  exOrderId?: string;

  execPrice?: number;

  execSize?: number;

  execAmount?: number;

  exCreatedAt?: string;

  exUpdatedAt?: string;

  memo?: string;

}
