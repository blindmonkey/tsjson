import * as errors from 'errors/decoding/decoding-error';
import { Result } from 'result/result';

import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from './type-helper';

export class ExtractReader<T> extends AbstractReader<T> implements Reader<T> {
  expectedType: string;
  private reader: Reader<T>;
  private property: string;
  constructor(property: string, reader: Reader<T>) {
    super();
    this.property = property;
    this.reader = reader;
    this.expectedType = '{"' + property.replace('"', '\\"') + '": ' + reader.expectedType + '}';
  }
  read(obj: any): Result<T, errors.DecodingError> {
    if (Object.hasOwnProperty.call(obj, this.property)) {
      return this.reader.read(obj[this.property]);
    } else {
      return this.reader.read(null).mapFailure<errors.DecodingError>(() =>
        errors.InvalidTypeError.create(obj, this.expectedType, Types.determineType(obj).name));
    }
  }
}