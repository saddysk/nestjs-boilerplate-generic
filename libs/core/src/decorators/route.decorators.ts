import {
  applyDecorators,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Type,
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiResponseMetadata,
} from '@nestjs/swagger';
import { bool } from 'envalid';
import { isObject } from 'lodash';
import { ErrorDto } from '../dtos/error.dto';
import { ParseFormDataJsonPipe } from '../pipes/parse-form-data-json.pipe';
import {
  ApiArrayResponse,
  ApiListOkResponse,
  ApiPaginationOkResponse,
} from './api-page-ok-response.decorator';
import { Auth, IAuthOptions as IAuthDecoratorOptions } from './auth.decorators';
import { PublicRoute } from './public-route.decorator';

const onlyDocumentPublicApi = bool()._parse(process.env.SWAGGER_PUBLIC_ONLY ?? 'false');
const onlyPartnerApi = bool()._parse(process.env.SWAGGER_PARTNER_ONLY ?? 'false');

// eslint-disable-next-line @typescript-eslint/ban-types
type ResponseTypeOnly = Type<unknown> | Function | [Function] | string;
type ResponseTypeMeta = {
  dtoType?: 'ListDto' | 'PageDto' | 'ArrayDto';
  type: ResponseTypeOnly;
} & ApiResponseMetadata;

type IAuthOptions = {
  permissions?: string[];
  userTypes?: string[];
} & IAuthDecoratorOptions;

type ResponseType = ResponseTypeOnly | ResponseTypeMeta;

interface IMultipartOptions {
  jsonFields: string[];
}

interface IRouteOptions extends IAuthOptions {
  summary?: string;
  description?: string;
  defaultStatus?: HttpStatus;
  multipart?: IMultipartOptions;
  Ok?: ResponseType;
  Created?: ResponseType;
  NotFound?: ResponseType;
  Default?: ResponseType;
  BadRequest?: ResponseType;
  ValidationError?: ResponseType;
  ServerError?: ResponseType;
  Forbidden?: ResponseType;
  Unauthorized?: ResponseType;
  NoContent?: ResponseType;
}

export const DEFAULT_VALIDATION_PIPE = () =>
  new ValidationPipe({
    whitelist: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    transform: true,
    enableDebugMessages: true,
    dismissDefaultMessages: true,
    validationError: {
      target: false,
      value: false,
    },
    // forbidUnknownValues: true,
    // stopAtFirstError: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => new UnprocessableEntityException(errors, 'Validation failed'),
  });

function createApiResponse(status: number, responseType: ResponseType): MethodDecorator {
  let options: ApiResponseMetadata;

  const response =
    'type' in (responseType as object)
      ? (responseType as ResponseTypeMeta)
      : (responseType as ResponseTypeOnly);

  if ('dtoType' in (response as object)) {
    const meta: ResponseTypeMeta = response as ResponseTypeMeta;

    if (meta.dtoType === 'ListDto') {
      return ApiListOkResponse({
        type: meta.type as unknown as any,
        description: meta.description,
      });
    }

    if (meta.dtoType === 'PageDto') {
      return ApiPaginationOkResponse({
        type: meta.type as unknown as any,
        description: meta.description,
      });
    }

    if (meta.dtoType === 'ArrayDto') {
      return ApiArrayResponse({
        type: meta.type as unknown as any,
        description: meta.description,
      });
    }
  }

  if ('type' in (response as object)) {
    const meta: ResponseTypeMeta = response as ResponseTypeMeta;
    options = {
      status,
      ...meta,
    };
  } else {
    options = {
      status,
      type: response as unknown as any,
    };
  }

  return ApiResponse(options);
}

function defaultOptions(options: IRouteOptions): IRouteOptions {
  return {
    ServerError: ErrorDto,
    multipart: null,
    ...options,
  };
}

function routeOptions(options?: IRouteOptions | ResponseType): IRouteOptions {
  if (options == null) {
    return {};
  }

  if (isObject(options)) {
    return options as unknown as IRouteOptions;
  }

  return {
    Ok: options as unknown as ResponseType,
  };
}

function prepareDecorators(_opts?: IRouteOptions | ResponseType): MethodDecorator[] {
  const options = defaultOptions(routeOptions(_opts));

  const {
    summary,
    description,
    Ok,
    Created,
    NoContent,
    NotFound,
    Default,
    BadRequest,
    ValidationError,
    ServerError,
    Forbidden,
    Unauthorized,
  } = options;

  const decorators: MethodDecorator[] = [HttpCode(options.defaultStatus ?? (Created ? 201 : 200))];

  if (options.isPublic !== true) {
    decorators.push(
      Auth(options.permissions, options.userTypes, {
        isPublic: options.isPublic,
        checkCaptcha: options.checkCaptcha,
        isBearer: options.isBearer ?? false,
        isInternal: options.isInternal ?? false,
      })
    );
  } else {
    // TODO: Need to find better way to do this
    decorators.push(PublicRoute(options.isPublic));
  }

  if (options.multipart != null) {
    decorators.push(
      ApiConsumes('multipart/form-data'),
      UsePipes(
        new ParseFormDataJsonPipe({
          jsonFields: options.multipart.jsonFields,
        }),
        DEFAULT_VALIDATION_PIPE()
      )
    );
  } else {
    decorators.push(UsePipes(DEFAULT_VALIDATION_PIPE()));
  }

  if (summary || description) {
    // const desc = `${description ?? ''}
    // *Roles*: ${rolesString(options.userTypes)}
    // *Permissions*: ${rolesString(options.permissions)}`;
    decorators.push(
      ApiOperation({
        summary,
        description,
      })
    );
  }

  if ((onlyPartnerApi && description !== 'partner_api') || (onlyDocumentPublicApi && !options.isBearer)) {
    decorators.push(ApiExcludeEndpoint());
  }

  Ok && decorators.push(createApiResponse(200, Ok));
  Created && decorators.push(createApiResponse(201, Created));
  NoContent && decorators.push(createApiResponse(204, NoContent));
  NotFound && decorators.push(createApiResponse(404, NotFound));
  Default && decorators.push(createApiResponse(200, Default));
  BadRequest && decorators.push(createApiResponse(400, BadRequest));
  ValidationError && decorators.push(createApiResponse(422, ValidationError));
  Forbidden && decorators.push(createApiResponse(403, Forbidden));
  Unauthorized && decorators.push(createApiResponse(401, Unauthorized));
  ServerError && decorators.push(createApiResponse(500, ServerError));

  return decorators;
}

// function rolesString(roles?: string[]) {
//   return roles == null || roles.length === 0 ? 'Any' : roles.join(' ,');
// }

export function GetRoute(path?: string | string[], options?: IRouteOptions | ResponseType): MethodDecorator {
  const decorators: MethodDecorator[] = [Get(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}

export function PostRoute(path?: string | string[], options?: IRouteOptions | ResponseType): MethodDecorator {
  const decorators: MethodDecorator[] = [Post(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}

export function PutRoute(path?: string | string[], options?: IRouteOptions | ResponseType): MethodDecorator {
  const decorators: MethodDecorator[] = [Put(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}

export function DeleteRoute(
  path?: string | string[],
  options?: IRouteOptions | ResponseType
): MethodDecorator {
  const decorators: MethodDecorator[] = [Delete(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}

export function PatchRoute(
  path?: string | string[],
  options?: IRouteOptions | ResponseType
): MethodDecorator {
  const decorators: MethodDecorator[] = [Patch(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}
