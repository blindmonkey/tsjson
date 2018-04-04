import { Result, ResultFailure, ResultSuccess } from './interface';

export class ResultFailureImpl<T, E> implements ResultFailure<T, E>, Result<T, E> {
  type: 'failure' = 'failure';
  error: E;
  constructor(error: E) {
    this.error = error;
  }

  isSuccess(): this is ResultSuccess<T, E> { return false }
  isFailure(): this is ResultFailure<T, E> { return true }

  map<Output>(
    success: (value: T) => Output,
    failure: (error: E) => Output
  ): Output {
    return failure(this.error);
  }

  flatMap<OutSuccess, OutFailure>(
    success: (value: any) => Result<OutSuccess, OutFailure>,
    failure: (error: E) => Result<OutSuccess, OutFailure>
  ): Result<OutSuccess, OutFailure> {
    return failure(this.error);
  }

  mapSuccess<OutSuccess>(f: (value: T) => OutSuccess): Result<OutSuccess, E> {
    return new ResultFailureImpl(this.error);
  }
  mapFailure<OutFailure>(f: (value: E) => OutFailure): Result<T, OutFailure> {
    return new ResultFailureImpl(f(this.error));
  }
}
