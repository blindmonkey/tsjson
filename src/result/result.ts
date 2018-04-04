import { Result as R, ResultSuccess, ResultFailure } from './interface';
import { ResultSuccessImpl } from './success';
import { ResultFailureImpl } from './failure';
import { unreachable } from '../unreachable';

export type Result<Success, Failure> = R<Success, Failure>;

export namespace Result {
  export function success<T, E>(value: T): Result<T, E> {
    return new ResultSuccessImpl(value);
  }
  export function failure<T, E>(value: E): Result<T, E> {
    return new ResultFailureImpl(value);
  }

  export function all<T, E>(results: Result<T, E>[]): Result<T[], E[]> {
    const successes: ResultSuccess<T, E>[] = [];
    const failures: ResultFailure<T, E>[] = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.isSuccess()) {
        successes.push(result)
      } else if (result.isFailure()) {
        failures.push(result)
      } else {
        /* istanbul ignore next */
        return unreachable("A result must either be a success or a failure.");
      }
    }
    if (failures.length > 0) {
      return Result.failure(failures.map((f) => f.error));
    }
    return Result.success(successes.map((f) => f.value));
  }
}
