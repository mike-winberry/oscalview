export interface Gen {
  ValidationResult?: ValidationResult;
  [property: string]: any;
}

export interface ValidationResult {
  errors?: Empty[];
  metadata?: Metadata;
  timeStamp?: Date;
  valid?: boolean;
  [property: string]: any;
}

export interface Empty {
  absoluteKeywordLocation?: string;
  error?: string;
  failedValue?: any;
  instanceLocation?: string;
  keywordLocation?: string;
  [property: string]: any;
}

export interface Metadata {
  documentPath?: string;
  documentType?: string;
  documentVersion?: string;
  schemaVersion?: string;
  [property: string]: any;
}
