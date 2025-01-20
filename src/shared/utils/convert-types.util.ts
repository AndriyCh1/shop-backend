/* eslint-disable @typescript-eslint/no-explicit-any */
import { isInt, isNumber } from 'class-validator';

/**
 * Allows to convert a value to a number, if it is not a number, it returns the fallback.
 * Fallback is optional and can be any value is needed.
 *
 * Useful for converting unknown value types to number.
 */
export const toNumberOrFallback = (value: unknown, fallback?: any) => {
  const number = Number(value);

  return isNumber(number) ? number : fallback;
};

/**
 * Allows to convert a value to an integer, if it is not an integer, it returns the fallback value.
 *
 * Useful for converting unknown value types to integer.
 */
export const toIntOrFallback = (value: unknown, fallback?: any) => {
  const number = Number(value);

  return isInt(number) ? number : fallback;
};

/**
 * Converts a value to an array of integers, if the value is not an array, it returns an empty array.
 */
export const toIntArrayOrSkip = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => toIntOrFallback(item))
      .filter((item) => item !== undefined);
  }

  return [];
};
