/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-unsafe-argument */
import type { Type } from '@nestjs/common';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { PARAMTYPES_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiQuery,
  ApiQueryOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import type { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { reverseObjectKeys } from '@nestjs/swagger/dist/utils/reverse-object-keys.util';
import * as _ from 'lodash';
import { IApiFile } from '../interfaces/file.interface';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

function explore(instance: Object, propertyKey: string | symbol) {
  const types: Array<Type<unknown>> = Reflect.getMetadata(PARAMTYPES_METADATA, instance, propertyKey);
  const routeArgsMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, instance.constructor, propertyKey) || {};

  const parametersWithType = _.mapValues(reverseObjectKeys(routeArgsMetadata), (param) => ({
    type: types[param.index],
    name: param.data,
    required: true,
  }));

  for (const [key, value] of Object.entries(parametersWithType)) {
    const keyPair = key.split(':');

    if (Number(keyPair[0]) === RouteParamtypes.BODY) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return value.type;
    }
  }
}

function RegisterModels(): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const body = explore(target, propertyKey);

    return body && ApiExtraModels(body)(target, propertyKey, descriptor);
  };
}

function ApiFileDecorator(
  files: IApiFile[] = [],
  options: Partial<{ isRequired: boolean }> = {}
): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const { isRequired = false } = options;
    const fileSchema: SchemaObject = {
      type: 'string',
      format: 'binary',
    };
    const properties: Record<string, SchemaObject | ReferenceObject> = {};

    for (const file of files) {
      if (file?.isArray) {
        properties[file.name] = {
          type: 'array',
          items: fileSchema,
        };
      } else {
        properties[file.name] = fileSchema;
      }
    }

    let schema: SchemaObject = {
      properties,
      type: 'object',
    };
    const body = explore(target, propertyKey);

    if (body) {
      schema = {
        allOf: [
          {
            $ref: getSchemaPath(body),
          },
          { properties, type: 'object' },
        ],
      };
    }

    return ApiBody({
      schema,
      required: isRequired,
    })(target, propertyKey, descriptor);
  };
}

export function ApiFile(
  files: _.Many<IApiFile>,
  options: Partial<{ isRequired: boolean; count?: number } & MulterOptions> = {}
): MethodDecorator {
  const filesArray = _.castArray(files);
  const apiFileInterceptors = filesArray.map((file) =>
    file.isArray
      ? UseInterceptors(FilesInterceptor(file.name, options.count || 1, options))
      : UseInterceptors(FileInterceptor(file.name, options))
  );

  return applyDecorators(
    RegisterModels(),
    ApiConsumes('multipart/form-data'),
    ApiFileDecorator(filesArray, options),
    ...apiFileInterceptors
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/explicit-module-boundary-types
export function ApiFilterQuery(fieldName: string, filterDto: Function) {
  return applyDecorators(
    ApiExtraModels(filterDto),
    ApiQuery({
      required: false,
      name: fieldName,
      style: 'deepObject',
      explode: true,
      type: 'object',
      schema: {
        $ref: getSchemaPath(filterDto),
      },
    })
  );
}

function getType(propertyType, propertyName: string): ApiQueryOptions {
  if (propertyType === String || propertyName === 'String') {
    return {
      type: 'string',
      schema: {
        type: 'string',
      },
    };
  }

  if (propertyType === Number || propertyName === 'Number') {
    return {
      type: 'number',
      schema: {
        type: 'number',
      },
    };
  }

  if (propertyType === Boolean || propertyName === 'Boolean') {
    return {
      type: 'boolean',
      schema: {
        type: 'boolean',
      },
    };
  }

  if (propertyType === Array || propertyName === 'Array') {
    return {
      isArray: true,
      type: 'array',
      schema: {
        type: 'string',
      },
    };
  }

  return {
    type: 'object',
    style: 'deepObject',
    explode: true,
    schema: {
      $ref: getSchemaPath(propertyType),
    },
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/explicit-module-boundary-types
export function ApiNestedQuery(query: Function) {
  const constructor = query.prototype;
  const properties = Reflect.getMetadata('swagger/apiModelPropertiesArray', constructor).map((prop) =>
    prop.substr(1)
  ) as string[];

  const decorators = properties
    .map((property) => {
      const propertyType = Reflect.getMetadata('design:type', constructor, property);

      // console.log('propertyType', property, , propertyType);

      return [
        ApiQuery({
          required: false,
          name: property,
          ...getType(propertyType, propertyType.name),
        }),
      ];
    })
    .flat();

  return applyDecorators(...decorators);
}
