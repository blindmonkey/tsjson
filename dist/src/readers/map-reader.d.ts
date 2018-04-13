import { DecodingError } from '../errors/decoding/decoding-error';
import { Result } from '../result/result';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';
export declare class MapReader<T> implements Reader<{
    [k: string]: T;
}> {
    expectedType: Types.Type;
    private valueReader;
    constructor(valueReader: Reader<T>);
    read(obj: any): Result<{
        [k: string]: T;
    }, DecodingError>;
}
