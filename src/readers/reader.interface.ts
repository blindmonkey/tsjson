import { DecodingError } from '../errors/decoding/decoding-error';
import { Result } from '../result/result';

import { Types } from '../jstypes';

export interface Reader<T> {
  expectedType: Types.Type;
  read(obj: any): Result<T, DecodingError>
}