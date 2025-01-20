import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsconfig = require('./tsconfig.json');

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>'],
  modulePaths: [tsconfig.compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default jestConfig;
