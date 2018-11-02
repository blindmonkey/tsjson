import * as errors from '../errors/decoding/decoding-error';

import { Reader } from './reader.interface';
import { AbstractReader } from './abstract-reader';
import { Types } from '../jstypes';
import { Result } from '../result/result';

export class AnyReader extends AbstractReader<any> implements Reader<any> {
  expectedType = Types.Any;
  read(obj: any): Result<any, errors.DecodingError> {
    return Result.success(obj);
  }
}