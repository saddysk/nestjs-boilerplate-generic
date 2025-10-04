import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export type IParseFormDataJsonOptions = {
  jsonFields: string[];
};

export class ParseFormDataJsonPipe implements PipeTransform {
  constructor(private readonly options?: IParseFormDataJsonOptions) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const { jsonFields } = this.options;
    const serializedValue = value;
    const transformedProperties = {};

    if (jsonFields.length === 0 || _metadata.type != 'body') {
      return value;
    }

    jsonFields.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(serializedValue, key)) {
        return;
      }

      if (key == null || key == '') {
        transformedProperties[key] = null;
        return;
      }

      transformedProperties[key] = JSON.parse(serializedValue[key]);
    });

    return { ...serializedValue, ...transformedProperties };
  }
}
