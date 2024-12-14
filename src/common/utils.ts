import { DateTime, DateTimeOptions } from 'luxon';

export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function numFormatter(val: string | number, digits = 3): string {
  const num = +val;
  if (isNaN(num)) {
    return '';
  }
  if (num === 0) {
    return '0';
  }
  let numAbs = Math.abs(num);
  if (numAbs < 0.001) {
    return num.toPrecision(digits);
  }

  const sign = num < 0 ? '-' : '';
  let unit = '';
  const K = 1000;
  const M = K * K;
  const B = K * M;
  if (numAbs >= B) {
    numAbs = numAbs / B;
    unit = 'B';
  } else if (numAbs >= M) {
    numAbs = numAbs / M;
    unit = 'M';
  } else if (numAbs >= K) {
    numAbs = numAbs / K;
    unit = 'K';
  }
  const nums = numAbs.toPrecision(digits);
  return sign + nums + unit;
}

export function volumeFormatter(val: string | number): string {
  return numFormatter(val, 3);
}


export function priceFormatter(val: string | number, digits = 6): string {
  const num = +val;
  if (isNaN(num)) {
    return '';
  }
  if (num === 0) {
    return '0';
  }
  return num.toPrecision(digits);
}

export function formatNumberFraction(number: number, digits: number): string {
  const format = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });

  return format.format(number);
}


export function formatDate(ts: number, interval: string = '1m', utc: boolean = false): string {
  // const ymPattern = 'yyyy-MM';
  // const ymdPattern = 'yyyy-MM-dd';
  const hmPattern = 'yyyy-MM-dd HH:mm ZZ';
  const hmsPattern = 'yyyy-MM-dd HH:mm:ss ZZ';

  const unit = interval[interval.length - 1];
  let format: string;

  if (['d', 'w', 'o'].includes(unit)) {
    if (utc) {
      return new Date(ts).toISOString().substring(0, 10);
    }
    format = hmPattern;
  } else if (['h', 'm'].includes(unit)) {
    if (utc) {
      const ds = new Date(ts).toISOString().replace('T', ' ');
      return ds.substring(0, 16);
    }
    format = hmPattern;
  } else {
    if (utc) {
      const ds = new Date(ts).toISOString().replace('T', ' ');
      return ds.substring(0, 19);
    }
    format = hmsPattern;
  }
  const dt = DateTime.fromMillis(ts);
  return dt.toFormat(format);
}


export const HOUR_MS = 60 * 60 * 1000;

export const DAY_MS = 24 * HOUR_MS;
