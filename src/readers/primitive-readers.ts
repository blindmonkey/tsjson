import { DecodingError, InvalidTypeError } from '../errors/decoding/decoding-error';
import { Result } from '../result/result';

import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';

export namespace PrimitiveReaders {
  export class BooleanReader extends AbstractReader<boolean> implements Reader<boolean> {
    expectedType = Types.Boolean;
    read(obj: any): Result<boolean, DecodingError> {
      if (typeof obj === 'boolean') {
        return Result.success(obj);
      }
      const inferred = Types.infer(obj);
      const typeString = inferred && Types.toString(inferred) || 'Unknown';
      return Result.failure(InvalidTypeError.create(
        obj, Types.toString(this.expectedType), typeString));
    }
  }

  export class StringReader extends AbstractReader<string> implements Reader<string> {
    expectedType = Types.String;
    read(obj: any): Result<string, DecodingError> {
      if (typeof obj === 'string') {
        return Result.success(obj);
      }
      const inferred = Types.infer(obj);
      const typeString = inferred && Types.toString(inferred) || 'Unknown';
      return Result.failure(InvalidTypeError.create(
        obj, Types.toString(this.expectedType), typeString));
    }
  }

  export class NumberReader extends AbstractReader<number> implements Reader<number> {
    expectedType = Types.Number;
    read(obj: any): Result<number, DecodingError> {
      if (typeof obj === 'number') {
        return Result.success(obj);
      }
      const inferred = Types.infer(obj);
      const typeString = inferred && Types.toString(inferred) || 'Unknown';
      return Result.failure(InvalidTypeError.create(
        obj, Types.toString(this.expectedType), typeString));
    }
  }
}