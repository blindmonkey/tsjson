import * as errors from '../errors/decoding/decoding-error';
import { Reader } from './reader.interface';
import { AbstractReader } from './abstract-reader';
import { Types } from '../jstypes';
import { Result } from '../result/result';
export declare class AnyReader extends AbstractReader<any> implements Reader<any> {
    readonly Type: any;
    expectedType: Types.AnyType;
    read(obj: any): Result<any, errors.DecodingError>;
}
