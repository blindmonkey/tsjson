import * as errors from 'errors/decoding/decoding-error';
import { Result } from 'result/result';

import { AbstractReader } from './abstract-reader'
import { Reader } from './reader.interface';
import { Types } from './type-helper';

interface EnumNoMatchError {
  type: 'enum-no-match';
  validValues: string[];
}
namespace EnumNoMatchError {
  export function create(values: string[]): EnumNoMatchError {
    return {
      type: 'enum-no-match',
      validValues: values
    };
  }
}

interface EnumReaderInterface<T extends string> {
  expectedValues: string[];
  isEmpty(): this is EmptyEnumReader;
  case<S extends string>(s: S): EnumReaderInterface<S|T>
  read(obj: any): Result<T, errors.DecodingError|EnumNoMatchError>
}


export class EmptyEnumReader implements EnumReaderInterface<never> {
  expectedValues = [];
  isEmpty(): this is EmptyEnumReader { return true }
  case<S extends string>(s: S): EnumReaderInterface<S> {
    return new EnumValueReader(s, this);
  }
  read(obj: any): Result<never, errors.DecodingError|EnumNoMatchError> {
    if (typeof obj !== 'string') {
      return Result.failure(errors.InvalidTypeError.create(obj, Types.StringType, Types.determineType(obj).name));
    }
    return Result.failure(EnumNoMatchError.create([]));
  }
}

export class EnumValueReader<T extends string, Base extends string> implements EnumReaderInterface<T|Base> {
  expectedValues: string[];
  private baseReader: EnumReaderInterface<Base>;
  private value: T;
  constructor(value: T, baseReader: EnumReaderInterface<Base>) {
    this.value = value;
    this.baseReader = baseReader;
    this.expectedValues = baseReader.expectedValues.concat([value]);
  }
  isEmpty(): this is EmptyEnumReader { return false }
  case<S extends string>(s: S): EnumReaderInterface<S|T|Base> {
    return new EnumValueReader<S, T|Base>(s, this);
  }
  read(obj: any): Result<T|Base, errors.DecodingError|EnumNoMatchError> {
    if (typeof obj !== 'string') {
      return Result.failure(errors.InvalidTypeError.create(obj, Types.StringType, Types.determineType(obj).name));
    }
    if (obj === this.value) {
      return Result.success(this.value);
    }
    return this.baseReader.read(obj).mapFailure((failure) => {
      if (failure.type === 'enum-no-match') {
        return EnumNoMatchError.create(failure.validValues.concat([this.value]))
      }
      return failure;
    });
  }
}

export class EnumReader<T extends string> extends AbstractReader<T> implements Reader<T> {
  expectedType: string;
  private base: EnumReaderInterface<T>;
  constructor(base: EnumReaderInterface<T>) {
    super();
    this.base = base;
    this.expectedType = base.expectedValues.map((v) => Types.quoteAndEscape('"', v)).join('|');
  }
  case<S extends string>(s: S): EnumReader<T|S> {
    return new EnumReader(this.base.case(s));
  }
  read(obj: any): Result<T, errors.DecodingError> {
    return this.base.read(obj).mapFailure((failure) => {
      if (failure.type === 'enum-no-match') {
        return errors.InvalidTypeError.create(obj, this.expectedType, Types.determineType(obj).name + ' (' + obj + ')');
      }
      return failure;
    });
  }
}
