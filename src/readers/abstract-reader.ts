import { DecodingError } from 'errors/decoding/decoding-error';
import { Result } from 'result/result';

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

export class OptionalReader<T> extends DefaultReader<T|null> {
  constructor(reader: Reader<T>) {
    super(reader, null);
    this.expectedType = Types.Nullable(reader.expectedType);
  }
}