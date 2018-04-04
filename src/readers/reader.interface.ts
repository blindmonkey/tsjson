import { DecodingError } from 'errors/decoding/decoding-error';
import { Result } from 'result/result';

export interface Reader<T> {
  expectedType: string;
  read(obj: any): Result<T, DecodingError>
}