import * as errors from 'errors/decoding/decoding-error';
import { Result } from 'result/result';
import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';
export declare class ExtractReader<T> extends AbstractReader<T> implements Reader<T> {
    expectedType: Types.Type;
    private reader;
    private property;
    constructor(property: string, reader: Reader<T>);
    read(obj: any): Result<T, errors.DecodingError>;
}
