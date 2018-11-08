import { DecodingError, InvalidTypeError } from '../errors/decoding/decoding-error';
import { Result } from '../result/result';

import { Reader } from './reader.interface';
import { Types, quote } from '../jstypes';

export class MapReader<T> implements Reader<{ [k: string]: T }> {
  readonly Type!: { [k: string]: T };
  expectedType: Types.Type;
  private valueReader: Reader<T>;
  constructor(valueReader: Reader<T>) {
    this.valueReader = valueReader;
    this.expectedType = Types.Map(valueReader.expectedType);
  }

  read(obj: any): Result<{ [k: string]: T }, DecodingError> {
    if (typeof obj === 'object') {
      const decoded: { [k: string]: T } = {};
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          const decodedValue = this.valueReader.read(value);
          if (decodedValue.isSuccess()) {
            decoded[key] = decodedValue.value;
          } else {
            let typeString: string = '{' + quote(key) + ': Unknown}';
            const objSpec: { [k: string]: Types.Type } = {};
            const inferredType = Types.infer(value);
            if (inferredType != null) {
              objSpec[key] = inferredType;
              typeString = Types.toString(Types.Object(objSpec));
            }
            return Result.failure(InvalidTypeError.create(
              obj,
              Types.toString(this.expectedType),
              typeString,
              decodedValue.isFailure() ? decodedValue.error : undefined
            ));
          }
        }
      }
      return Result.success(decoded);
    }
    const inferredType = Types.infer(obj);
    return Result.failure(InvalidTypeError.create(
      obj, Types.toString(this.expectedType), inferredType && Types.toString(inferredType) || 'Unknown'));
  }
}