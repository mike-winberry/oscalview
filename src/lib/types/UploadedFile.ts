import { ValidationResult } from './gen';

export type UploadedFile = {
  file?: File;
  content?: string;
  path?: string;
  name?: string;
  validationResult?: ValidationResult;
};

export class UploadedFileManager {
  private files: UploadedFile[] = [];

  constructor() {
    this.files = [];
  }

  addFile(file: UploadedFile) {
    this.files.push(file);
  }

  updateFile(name: string, file: UploadedFile) {
    const index = this.files.findIndex((file) => file.name === name);
    if (index !== -1) {
      this.files[index] = file;
    }
  }

  getFiles() {
    return this.files;
  }

  getFile(name: string) {
    return this.files.find((file) => file.name === name);
  }

  deleteFile(name: string) {
    this.files = this.files.filter((file) => file.name !== name);
  }
}
