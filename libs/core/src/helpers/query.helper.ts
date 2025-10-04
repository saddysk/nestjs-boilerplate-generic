import { each, isArray, isBoolean, isEmpty, isNumber, isObject, isString } from 'lodash';
import { AbstractEntity } from 'src/database/entities/abstract.entity';

import {
  Any,
  Between,
  Equal,
  FindManyOptions,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import {
  DateFilterDto,
  DefaultResourceFilterDto,
  LIMIT_DEFAULT,
  NumberFilterDto,
  StringFilterDto,
} from '../dtos/filter.dto';

export function toFindMany<T = AbstractEntity, Q extends DefaultResourceFilterDto = DefaultResourceFilterDto>(
  query: Q,
  overrides?: FindManyOptions<T>
): FindManyOptions<T> {
  if (query == null) {
    return overrides;
  }

  const { where, ...rest } = overrides ?? {};
  const { page = 1, limit = LIMIT_DEFAULT, ids, createdAt, ...fields } = query;

  const options: FindManyOptions<T> = {
    take: limit,
    skip: (page - 1) * limit,
    where: {},
    ...(rest ?? {}),
  };

  if (isArray(ids) && !isEmpty(ids)) {
    options.where['id'] = In(ids);
  }

  if (createdAt) {
    options.where['createdAt'] = toFilter(createdAt);
  }

  each(fields, (value: any, key: string) => {
    options.where[key] = toFilter(value);
  });

  const final = {
    ...options,
    where: {
      ...(options.where ?? {}),
      ...(where ?? {}),
    },
  };

  return final;
}

export function toFilter(
  filter: string | number | boolean | string[] | NumberFilterDto | DateFilterDto | StringFilterDto
) {
  if (filter == null) {
    return;
  }

  if (isString(filter) || isBoolean(filter) || isNumber(filter)) {
    return filter;
  }

  if (isArray(filter)) {
    return filter?.length > 0 ? In(filter) : undefined;
  }

  if (
    !isObject(filter) ||
    !(
      filter instanceof DateFilterDto ||
      filter instanceof NumberFilterDto ||
      filter instanceof StringFilterDto
    )
  ) {
    return;
  }

  if (filter.notnull) {
    return Not(IsNull());
  }

  if (filter.isnull) {
    return IsNull();
  }

  if (filter instanceof NumberFilterDto) {
    if (filter.eq != null) {
      return Equal(filter.eq);
    }

    if (!isEmpty(filter.in)) {
      return In(filter.in);
    }

    if (!isEmpty(filter.any)) {
      return Any(filter.any);
    }
  }

  if (filter instanceof StringFilterDto) {
    if (filter.like != null) {
      return Like(filter.like);
    }

    if (filter.ilike != null) {
      return ILike(filter.ilike);
    }
  }

  if (filter instanceof NumberFilterDto || filter instanceof DateFilterDto) {
    if (filter.gte != null && filter.lte != null) {
      return Between(filter.lte, filter.gte);
    }

    if (filter.gt != null) {
      return MoreThan(filter.gt);
    }

    if (filter.gte != null) {
      return MoreThanOrEqual(filter.gte);
    }

    if (filter.lt != null) {
      return LessThan(filter.lt);
    }

    if (filter.lt != null) {
      return LessThanOrEqual(filter.lt);
    }
  }
}
