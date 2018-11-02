import * as errors from '../errors/decoding/decoding-error';
import { Result } from '../result/result';

import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';

export class ExtractReader<T> extends AbstractReader<T> implements Reader<T> {
  expectedType: Types.Type;
  private reader: Reader<T>;
  private property: string;
  constructor(property: string, reader: Reader<T>) {
    super();
    this.property = property;
    this.reader = reader;
    const obj: {[k:string]: Types.Type} = {};
    obj[property] = reader.expectedType;
    // console.log('Extract', property, 'of type', reader.expectedType);
    this.expectedType = Types.Object(obj);
    // console.log('Computed expected type is', this.expectedType);
  }
  read(obj: any): Result<T, errors.DecodingError> {
    if (obj && Object.hasOwnProperty.call(obj, this.property)) {
      return this.reader.read(obj[this.property]);
    } else {
      return this.reader.read(null).mapFailure<errors.DecodingError>(() => {
        const inferred = Types.infer(obj);
        const typeString = inferred && Types.toString(inferred) || 'Unknown';
        return errors.InvalidTypeError.create(obj, Types.toString(this.expectedType), typeString);
      });
    }
  }
}