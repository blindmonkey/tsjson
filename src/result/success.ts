import { Result, ResultSuccess, ResultFailure } from './interface';

export class ResultSuccessImpl<T, E> implements ResultSuccess<T, E> {
  type: 'success' = 'success';
  value: T;
  constructor(value: T) {
    this.value = value;
  }

  isSuccess(): this is ResultSuccess<T, E> { return true }
  isFailure(): this is ResultFailure<T, E> { return false }

  map<Output>(
    success: (value: T) => Output,
    failure: (error: E) => Output
  ): Output {
    return success(this.value);
  }

  flatMap<OutSuccess, OutFailure>(
    success: (value: T) => Result<OutSuccess, OutFailure>,
    failure: (error: E) => Result<OutSuccess, OutFailure>
  ): Result<OutSuccess, OutFailure> {
    return success(this.value);
  }

  mapSuccess<OutSuccess>(f: (value: T) => OutSuccess): Result<OutSuccess, E> {
    return new ResultSuccessImpl(f(this.value));
  }
  mapFailure<OutFailure>(f: (value: E) => OutFailure): Result<T, OutFailure> {
    return new ResultSuccessImpl(this.value);
  }
}
