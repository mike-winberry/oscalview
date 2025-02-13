import { ValidationResult } from './gen';

export type UploadedFile = {
  file?: File;
  content?: string;
  path?: string;
  name?: string;
  validationResult?: ValidationResult;
  extension: 'json' | 'yaml';
};
