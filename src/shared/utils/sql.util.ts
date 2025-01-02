// Window function to count number of rows. More efficient than `COUNT(*)`
export const countOver = (fieldName: string) => {
  return `COUNT(*) OVER() AS "${fieldName}"`;
};
