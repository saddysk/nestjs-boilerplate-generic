import { FindOperator, Raw } from 'typeorm';

export const EqualOrNull = <T>(value: T): FindOperator<T> => {
  return Raw((columnAlias) => `${columnAlias} IS NULL OR ${columnAlias} = :value`, {
    value,
  });
};
