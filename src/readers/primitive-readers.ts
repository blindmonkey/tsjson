import { DecodingError, InvalidTypeError } from 'errors/decoding/decoding-error';
import { Result } from 'result/result';

import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from './type-helper';

export namespace PrimitiveReaders {
  export class BooleanReader extends AbstractReader<boolean> implements Reader<boolean> {
    expectedType = Types.BooleanType;
    read(obj: any): Result<boolean, DecodingError> {
      if (typeof obj === 'boolean') {
        return Result.success(obj);
      }
      return Result.failure(InvalidTypeError.create(
        obj, this.expectedType, Types.determineType(obj).name));
    }
  }

  export class StringReader extends AbstractReader<string> implements Reader<string> {
    expectedType = Types.StringType;
    read(obj: any): Result<string, DecodingError> {
      if (typeof obj === 'string') {
        return Result.success(obj);
      }
      return Result.failure(InvalidTypeError.create(
        obj, this.expectedType, Types.determineType(obj).name));
    }
  }

  export class NumberReader extends AbstractReader<number> implements Reader<number> {
    expectedType = Types.NumberType;
    read(obj: any): Result<number, DecodingError> {
      if (typeof obj === 'number') {
        return Result.success(obj);
      }
      return Result.failure(InvalidTypeError.create(
        obj, this.expectedType, Types.determineType(obj).name));
    }
  }
}