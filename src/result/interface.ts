export interface Result<Success, Failure> {
  type: 'success' | 'failure';

  isSuccess(): this is ResultSuccess<Success, Failure>
  isFailure(): this is ResultFailure<Success, Failure>

  map<Output>(
    success: (value: Success) => Output,
    failure: (value: Failure) => Output
  ): Output

  flatMap<OutSuccess, OutFailure>(
    success: (value: Success) => Result<OutSuccess, OutFailure>,
    failure: (error: Failure) => Result<OutSuccess, OutFailure>
  ): Result<OutSuccess, OutFailure>

  mapSuccess<OutSuccess>(f: (value: Success) => OutSuccess): Result<OutSuccess, Failure>
  mapFailure<OutFailure>(f: (value: Failure) => OutFailure): Result<Success, OutFailure>
}

export interface ResultSuccess<T, E> extends Result<T, E> {
  type: 'success';
  value: T;
}

export interface ResultFailure<T, E> extends Result<T, E> {
  type: 'failure';
  error: E;
}