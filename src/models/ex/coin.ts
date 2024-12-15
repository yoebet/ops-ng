import { BaseModel } from '@/models/base-model';

export class Coin extends BaseModel {
  coin: string;

  name?: string;

  stable: boolean = false;
}
