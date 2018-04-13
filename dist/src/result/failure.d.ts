import { Result, ResultFailure, ResultSuccess } from './interface';
export declare class ResultFailureImpl<T, E> implements ResultFailure<T, E>, Result<T, E> {
    type: 'failure';
    error: E;
    constructor(error: E);
    isSuccess(): this is ResultSuccess<T, E>;
    isFailure(): this is ResultFailure<T, E>;
    assertSuccess(): T;
    assertFailure(): E;
    map<Output>(success: (value: T) => Output, failure: (error: E) => Output): Output;
    flatMap<OutSuccess, OutFailure>(success: (value: any) => Result<OutSuccess, OutFailure>, failure: (error: E) => Result<OutSuccess, OutFailure>): Result<OutSuccess, OutFailure>;
    mapSuccess<OutSuccess>(f: (value: T) => OutSuccess): Result<OutSuccess, E>;
    mapFailure<OutFailure>(f: (value: E) => OutFailure): Result<T, OutFailure>;
}
