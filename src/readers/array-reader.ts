import { DecodingError, ErrorGroup, ArrayChildError, InvalidTypeError } from '../errors/decoding/decoding-error';
import { Result } from '../result/result';

import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';

export class ArrayReader<T> extends AbstractReader<T[]> implements Reader<T[]> {
  readonly Type!: T[];
  expectedType: Types.ArrayType;
  private reader: Reader<T>;
  constructor(reader: Reader<T>) {
    super();
    this.reader = reader;
    this.expectedType = Types.Array(reader.expectedType);
  }
  read(obj: any): Result<T[], DecodingError> {
    if (obj && typeof obj.length === 'number') {
      const array = obj as Array<any>
      const results = array.map((v, index) => this.reader.read(v).mapFailure((e) => ({index: index, error: e})));
      Result.all(results);
      return Result.all(results)
        .mapFailure((errors) => ErrorGroup.create(
          obj, errors.map((error) => ArrayChildError.create(error.index, error.error))));
    }
    const inferredType = Types.infer(obj);
    const typeString = inferredType && Types.toString(inferredType) || 'Unknown';
    return Result.failure(InvalidTypeError.create(obj, this.expectedType.toString(), typeString));
  }
}
