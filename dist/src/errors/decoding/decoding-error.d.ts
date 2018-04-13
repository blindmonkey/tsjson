export interface ArrayChildError {
    type: 'array-error';
    index: number;
    error: DecodingError;
}
export declare namespace ArrayChildError {
    function create(index: number, error: DecodingError): ArrayChildError;
}
export interface ErrorGroup {
    type: 'error-group';
    errors: DecodingError[];
    value: any;
}
export declare namespace ErrorGroup {
    function create(value: any, errors: DecodingError[]): ErrorGroup;
}
export interface InconsistentTypesError {
    type: 'inconsistent-types';
    found: string[];
    value: any;
}
export declare namespace InconsistentTypesError {
    function create(value: any, found: string[]): InconsistentTypesError;
}
export interface InvalidTypeError {
    type: 'invalid-type';
    expected: string;
    actual: string;
    value: any;
    error: DecodingError | null;
}
export declare namespace InvalidTypeError {
    function create(value: any, expected: string, actual: string, forwarded?: DecodingError): InvalidTypeError;
}
export declare type DecodingError = InvalidTypeError | InconsistentTypesError | ArrayChildError | ErrorGroup;
