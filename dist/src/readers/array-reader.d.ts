import { DecodingError } from 'errors/decoding/decoding-error';
import { Result } from 'result/result';
import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';
export declare class ArrayReader<T> extends AbstractReader<T[]> implements Reader<T[]> {
    expectedType: Types.ArrayType;
    private reader;
    constructor(reader: Reader<T>);
    read(obj: any): Result<T[], DecodingError>;
}
