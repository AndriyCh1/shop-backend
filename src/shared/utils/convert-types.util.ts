/* eslint-disable @typescript-eslint/no-explicit-any */
import { isInt, isNumber } from 'class-validator';

export const toNumberOrFallback = (value: any, fallback?: any) => {
  const number = Number(value);

  return isNumber(number) ? number : fallback;
};

export const toIntOrFallback = (value: any, fallback?: any) => {
  const number = Number(value);

  return isInt(number) ? number : fallback;
};

export const toIntArrayOrSkip = (value: any) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => toIntOrFallback(item))
      .filter((item) => item !== undefined);
  }

  return [];
};
