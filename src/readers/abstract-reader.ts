import { DecodingError, InvalidTypeError, ErrorGroup } from '../errors/decoding/decoding-error';
import { Result } from '../result/result';

import { Reader } from './reader.interface';
import { Types } from '../jstypes';

export abstract class AbstractReader<T> implements Reader<T> {
  abstract expectedType: Types.Type;
  abstract read(obj: any): Result<T, DecodingError>

  withDefault(value: T): DefaultReader<T> {
    return new DefaultReader(this, value);
  }

  asOptional(): OptionalReader<T> {
    return new OptionalReader(this);
  }

  or<S>(other: Reader<S>): Reader<T|S> {
    return new OrReader(this, other);
  }
}

export class DefaultReader<T> extends AbstractReader<T> implements Reader<T> {
  expectedType: Types.Type;
  private reader: Reader<T>;
  private default: T;
  constructor(reader: Reader<T>, defaultValue: T) {
    super();
    this.reader = reader;
    this.default = defaultValue;
    this.expectedType = reader.expectedType;
  }
  read(obj: any): Result<T, DecodingError> {
    return Result.success(this.reader.read(obj)
      .map((success) => success,
           () => this.default));
  }
}

function inferOrUnknown(obj: any): string {
  const inferred = Types.infer(obj);
  if (inferred != null) {
    return Types.toString(inferred);
  }
  return 'Unknown';
}

export class OrReader<A, B> extends AbstractReader<A|B> implements Reader<A|B> {
  expectedType: Types.Type;
  private readerA: Reader<A>;
  private readerB: Reader<B>;
  constructor(readerA: Reader<A>, readerB: Reader<B>) {
    super();
    this.readerA = readerA;
    this.readerB = readerB;
    this.expectedType = Types.Union([readerA.expectedType, readerB.expectedType]);
  }
  read(obj: any): Result<A|B, DecodingError> {
    return this.readerA.read(obj).map<Result<A|B, DecodingError>>(
      (success) => Result.success(success),
      (failure) => this.readerB.read(obj)
        .mapFailure((error) => InvalidTypeError.create(
          obj,
          Types.toString(this.expectedType),
          inferOrUnknown(obj),
          ErrorGroup.create(obj, [failure, error])))
      );
  }
}

export class OptionalReader<T> extends DefaultReader<T|null> {
  constructor(reader: Reader<T>) {
    super(reader, null);
    this.expectedType = Types.Nullable(reader.expectedType);
  }
}