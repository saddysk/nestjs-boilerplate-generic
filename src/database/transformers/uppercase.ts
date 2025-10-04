import { ValueTransformer } from 'typeorm';

export const UpperCaseTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue && entityValue.toUpperCase(),
  from: (databaseValue: string): string => {
    return databaseValue;
  },
};
