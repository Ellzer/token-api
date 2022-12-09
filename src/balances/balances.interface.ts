export interface Balance {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  balanceUsd: number;
}

export enum NetworkNames {
  eth = 'homestead',
  poly = 'matic',
  arb = 'arbitrum',
}

export type Networks = keyof typeof NetworkNames;
