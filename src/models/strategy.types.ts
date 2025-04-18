import { TradeSide } from '@/models/base';

export enum StrategyAlgo {
  INT = 'INT',
}

export enum OppCheckerAlgo {
  MV = 'MV',
  BR = 'BR',
  TP = 'TP',
  LS = 'LS',
  JP = 'JP',
  BB = 'BB',
}

export declare type ConsiderSide = TradeSide | 'both';
