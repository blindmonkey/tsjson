import { DecodingError } from 'errors/decoding/decoding-error';
import { Result } from 'result/result';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';
export declare abstract class AbstractReader<T> implements Reader<T> {
    abstract expectedType: Types.Type;
    abstract read(obj: any): Result<T, DecodingError>;
    withDefault(value: T): DefaultReader<T>;
    asOptional(): OptionalReader<T>;
}
export declare class DefaultReader<T> extends AbstractReader<T> implements Reader<T> {
    expectedType: Types.Type;
    private reader;
    private default;
    constructor(reader: Reader<T>, defaultValue: T);
    read(obj: any): Result<T, DecodingError>;
}
export declare class OptionalReader<T> extends DefaultReader<T | null> {
    constructor(reader: Reader<T>);
}
