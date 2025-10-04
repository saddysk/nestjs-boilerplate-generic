export interface IFile {
  encoding: string;
  buffer?: Buffer;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
  path?: string;
}

export interface IApiFile {
  name: string;
  isArray?: boolean;
}
