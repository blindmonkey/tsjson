import * as errors from 'errors/decoding/decoding-error';
import { Result } from 'result/result';

import { AbstractReader } from './abstract-reader'
import { Reader } from './reader.interface';
import { ExtractReader } from './extract-reader';
import { Types } from '../jstypes';

export interface ObjectConstructorInterface<T extends {}> extends Reader<T> {
  // expectedTypes: {[k: string]: string};
  expectedType: Types.Type;
  isEmpty(): this is EmptyObjectConstructor;
  put<S extends string, U>(s: S & string, reader: Reader<U>): ObjectConstructorInterface<{[s in S]: U} & T>
  prop<S extends string, U>(s: S & string, reader: Reader<U>): ObjectConstructorInterface<{[s in S]: U} & T>
  read(obj: any): Result<T, errors.DecodingError>
}

export class EmptyObjectConstructor extends AbstractReader<{}> implements ObjectConstructorInterface<{}> {
  expectedType = Types.Object({});
  // expectedTypes = {};
  isEmpty(): this is EmptyObjectConstructor { return true; }
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
  expectedType: Types.Type;
  // expectedTypes: {[k: string]: string};
  private property: S;
  private reader: Reader<U>;
  private base: Reader<Base>;
  constructor(property: S, reader: Reader<U>, base: ObjectConstructorInterface<Base>) {
    // const baseExpectedTypes = base.expectedTypes;
    // const expectedTypes: {[k: string]: string} = {};
    // const expectedTypePairs: string[] = [];
    // for (var k in baseExpectedTypes) {
    //   if (Object.hasOwnProperty.call(baseExpectedTypes, k)) {
    //     const baseExpectedType = baseExpectedTypes[k];
    //     expectedTypes[k] = baseExpectedType;
    //     expectedTypePairs.push(Types.quoteAndEscape('"', k) + ': ' + baseExpectedType);
    //   }
    // }
    // expectedTypes[property] = reader.expectedType;
    // expectedTypePairs.push(Types.quoteAndEscape('"', property) + ': ' + reader.expectedType);
    // this.expectedTypes = expectedTypes;
    console.log('Combining', reader.expectedType, 'and', base.expectedType);
    const combinedType = Types.combine(base.expectedType, reader.expectedType);
    console.log('Combined:', combinedType);
    if (combinedType == null) {
      throw Error('Unable to combine types: ' + base.expectedType.toString() + ' and ' + reader.expectedType.toString());
    }
    this.expectedType = combinedType; // ['{', expectedTypePairs.join(', '), '}'].join('');
    this.property = property;
    this.reader = reader;
    this.base = base;
  }
  isEmpty(): this is EmptyObjectConstructor { return false }
  put<NewS extends string, NewU>(s: NewS, reader: Reader<NewU>): ObjectConstructorInterface<{[s in NewS]: NewU} & {[s in S]: U} & Base> {
    return new ObjectConstructor<NewS, NewU, {[s in S]: U} & Base>(s, reader, this);
  }
  prop<NewS extends string, NewU>(s: NewS, reader: Reader<NewU>): ObjectConstructorInterface<{[s in NewS]: NewU} & {[s in S]: U} & Base> {
    return new ObjectConstructor<NewS, NewU, {[s in S]: U} & Base>(s, new ExtractReader(s, reader), this);
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
      (failure: errors.DecodingError) => {
        if (failure.type == 'invalid-type') {
          const inferred = Types.infer(obj);
          const typeString = inferred && Types.toString(inferred) || 'Unknown';
          return Result.failure(errors.InvalidTypeError.create(obj, Types.toString(this.expectedType), typeString, failure))
        }
        return Result.failure(failure)
      });
  }
}
