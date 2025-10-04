import { BadRequestException, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { isArray } from 'lodash';
import { IFile } from '../interfaces/file.interface';

type IBusyBoyFile = Pick<IFile, 'fieldname' | 'encoding' | 'mimetype' | 'originalname'>;
type IFileValidator = (file: IBusyBoyFile) => boolean;

const imageMimeTypes = ['image/jpeg', 'image/png'];

export function isImage(): IFileValidator {
  return hasMimeTypes(imageMimeTypes);
}

export function hasMimeTypes(mimetypes: string[]): IFileValidator {
  return (file: IBusyBoyFile) => {
    return mimetypes.includes(file.mimetype);
  };
}

export function hasExtension(extensions: string[]): IFileValidator {
  return (file: IBusyBoyFile) => {
    return extensions.includes(file.originalname.split('.').pop()?.toLowerCase());
  };
}

export const validateFile = (
  rule: IFileValidator | IFileValidator[],
  onError: (error) => HttpException = (e) => e
) => {
  return (req: Request, file: IFile, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const rules = isArray(rule) ? rule : [rule];

    let isValid = true;
    let error: any;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (const r of rules) {
      try {
        const result = r(file);
        if (!result) {
          isValid = false;
          break;
        }
      } catch (e) {
        isValid = false;
        error = e;
      }
    }

    if (isValid) {
      cb(null, true);
    } else {
      cb(
        onError(
          error ??
            new BadRequestException({
              message: 'Invalid file',
            })
        ),
        false
      );
    }
  };
};
