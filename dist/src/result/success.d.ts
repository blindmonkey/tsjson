import { Result, ResultSuccess, ResultFailure } from './interface';
export declare class ResultSuccessImpl<T, E> implements ResultSuccess<T, E> {
    type: 'success';
    value: T;
    constructor(value: T);
    isSuccess(): this is ResultSuccess<T, E>;
    isFailure(): this is ResultFailure<T, E>;
    map<Output>(success: (value: T) => Output, failure: (error: E) => Output): Output;
    flatMap<OutSuccess, OutFailure>(success: (value: T) => Result<OutSuccess, OutFailure>, failure: (error: E) => Result<OutSuccess, OutFailure>): Result<OutSuccess, OutFailure>;
    mapSuccess<OutSuccess>(f: (value: T) => OutSuccess): Result<OutSuccess, E>;
    mapFailure<OutFailure>(f: (value: E) => OutFailure): Result<T, OutFailure>;
}
