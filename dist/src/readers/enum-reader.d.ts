import * as errors from '../errors/decoding/decoding-error';
import { Result } from '../result/result';
import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';
export declare class EnumReader<T extends string> extends AbstractReader<T> implements Reader<T> {
    readonly Type: T;
    expectedType: Types.Type;
    private base;
    private constructor();
    static create(): EnumReader<never>;
    case<S extends string>(s: S): EnumReader<T | S>;
    read(obj: any): Result<T, errors.DecodingError>;
}
