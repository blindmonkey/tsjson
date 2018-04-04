export interface ArrayChildError {
  type: 'array-error';
  index: number;
  error: DecodingError;
}
export namespace ArrayChildError {
  export function create(index: number, error: DecodingError): ArrayChildError {
    return {
      type: 'array-error',
      index: index,
      error: error
    };
  }
}

export interface ErrorGroup {
  type: 'error-group';
  errors: DecodingError[];
  value: any;
}
export namespace ErrorGroup {
  export function create(value: any, errors: DecodingError[]): ErrorGroup {
    return {
      type: 'error-group',
      value: value,
      errors: errors
    };
  }
}

export interface InconsistentTypesError {
  type: 'inconsistent-types';
  found: string[];
  value: any;
}
export namespace InconsistentTypesError {
  export function create(value: any, found: string[]): InconsistentTypesError {
    return {
      type: 'inconsistent-types',
      value: value,
      found: found
    };
  }
}

export interface InvalidTypeError {
  type: 'invalid-type';
  expected: string;
  actual: string;
  value: any;
}
export namespace InvalidTypeError {
  export function create(value: any, expected: string, actual: string): InvalidTypeError {
    return {
      type: 'invalid-type',
      expected: expected,
      actual: actual,
      value: value
    };
  }
}


export type DecodingError = InvalidTypeError | InconsistentTypesError | ArrayChildError | ErrorGroup;
