import pg from 'pg';

/**
 * Initialize type parsers
 * Converts numeric strings from PostgreSQL to numbers
 * Credits: https://stackoverflow.com/a/57210469/21096329
 */
export const initializeTypeParsers = () => {
  pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
    return parseInt(value);
  });

  pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
    return parseFloat(value);
  });

  pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
    return parseFloat(value);
  });
};
