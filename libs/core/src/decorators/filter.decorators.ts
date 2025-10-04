import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptions } from '@nestjs/swagger';
import { StringFieldOptional } from './field.decorators';
import { Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';

export function ArrayFilterTransform() {
  return Transform(({ value }) => {
    if (!value) {
      return value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return [value];
    }

    return value;
  });
}

export function StringArrayFilterField(
  options: Parameters<typeof StringFieldOptional>[0] & ApiPropertyOptions = {}
): PropertyDecorator {
  return applyDecorators(
    ArrayFilterTransform(),
    ValidateIf(() => false),
    StringFieldOptional({
      isArray: true,
      ...options,
    })
  );
}

// export function StringArrayFilterField(
//   options: Parameters<typeof StringFieldOptional>[0] & ApiPropertyOptions = {}
// ): PropertyDecorator {
//   return applyDecorators(
//     ApiExtraModels(StringArrayFilterDto),
//     ArrayFilterTransform(),
//     ObjectFieldOptional(() => StringArrayFilterDto, {
//       type: null,
//       oneOf: [{ $ref: getSchemaPath(StringArrayFilterDto) }, { type: 'string' }],
//       ...options,
//     }),
//     ApiProperty({
//       type: [String, StringFilterDto],
//       ...options,
//     })
//   );
// }

// // export function StringFilterField(
// //   options: Parameters<typeof StringFieldOptional>[0] & ApiPropertyOptions = {}
// // ): PropertyDecorator {
// //   return applyDecorators(
// //     StringArrayFilterTransform(),
// //     ObjectFieldOptional(() => StringFilterDto, {
// //       type: () => Object,
// //       oneOf: [{ $ref: getSchemaPath(StringFilterDto) }, { type: 'string' }],
// //       ...options,
// //     }),
// //     ApiProperty({
// //       type: [String, StringFilterDto],
// //       ...options,
// //     })
// //   );
// // }

// // export function NumberFilterTransform() {
// //   return Transform((val) => {
// //     if (!val) {
// //       return val;
// //     }

// //     if (typeof val === 'string') {
// //       return Number(val);
// //     }

// //     return val;
// //   });
// // }

// // export function NumberArrayFilterField(
// //   options: Parameters<typeof NumberFieldOptional>[0] = {}
// // ): PropertyDecorator {
// //   return applyDecorators(NumberFilterTransform(), NumberFieldOptional({ isArray: true, ...options }));
// // }
