export const limitNumber = (value: number, maximum: number) => {
  return value < maximum ? value : maximum;
};
