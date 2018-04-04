import * as errors from 'errors/decoding/decoding-error';
import { Result } from 'result/result';

import { AbstractReader } from './abstract-reader'
import { Reader } from './reader.interface';
import { ExtractReader } from './extract-reader';
import { Types } from './type-helper';


interface ObjectConstructorInterface<T extends {}> extends Reader<T> {
  isEmpty(): this is EmptyObjectConstructor;
  put<S extends string, U>(s: S & string, reader: Reader<U>): ObjectConstructorInterface<{[s in S]: U} & T>
  prop<S extends string, U>(s: S & string, reader: Reader<U>): ObjectConstructorInterface<{[s in S]: U} & T>
  read(obj: any): Result<T, errors.DecodingError>
}

export class EmptyObjectConstructor extends AbstractReader<{}> implements ObjectConstructorInterface<{}> {
  expectedType = 'nothing';
  isEmpty(): this is EmptyObjectConstructor { return true }
  put<S extends string, U>(s: S, reader: Reader<U>): ObjectConstructorInterface<{[s in S]: U} & {}> {
    return new ObjectConstructor<S, U, {}>(s, reader, this);
  }
  prop<S extends string, U>(s: S, reader: Reader<U>): ObjectConstructorInterface<{[s in S]: U} & {}> {
    return new ObjectConstructor<S, U, {}>(s, new ExtractReader(s, reader), this);
  }
  read(): Result<{}, errors.DecodingError> {
    return Result.success({});
  }
}

export class ObjectConstructor<S extends string, U, Base> implements ObjectConstructorInterface<{[s in S]: U} & Base> {
  expectedType: string;
  private property: S;
  private reader: Reader<U>;
  private base: Reader<Base>;
  constructor(property: S, reader: Reader<U>, base: Reader<Base>) {
    this.expectedType = ['{', Types.quoteAndEscape('"', property), ': ', reader.expectedType, '}'].join('');
    this.property = property;
    this.reader = reader;
    this.base = base;
  }
  isEmpty(): this is EmptyObjectConstructor { return false }
  put<NewS extends string, NewU>(s: NewS, reader: Reader<NewU>): ObjectConstructorInterface<{[s in NewS]: NewU} & {[s in S]: U} & Base> {
    return new ObjectConstructor(s, reader, this);
  }
  prop<NewS extends string, NewU>(s: NewS, reader: Reader<NewU>): ObjectConstructorInterface<{[s in NewS]: NewU} & {[s in S]: U} & Base> {
    return new ObjectConstructor(s, new ExtractReader(s, reader), this);
  }
  read(obj: any): Result<{[s in S]: U} & Base, errors.DecodingError> {
    return this.base.read(obj).flatMap<{[s in S]: U} & Base, errors.DecodingError>(
      (baseSuccess: Base) => {
        return this.reader.read(obj).mapSuccess((success) => {
          const successObj: any = baseSuccess;
          successObj[this.property] = success;
          return successObj;
        });
      },
      (failure: errors.DecodingError) => Result.failure(failure));
  }
}