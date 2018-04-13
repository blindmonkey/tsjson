import { Result as R } from './interface';
export declare type Result<Success, Failure> = R<Success, Failure>;
export declare namespace Result {
    function success<T, E>(value: T): Result<T, E>;
    function failure<T, E>(value: E): Result<T, E>;
    function all<T, E>(results: Result<T, E>[]): Result<T[], E[]>;
}
