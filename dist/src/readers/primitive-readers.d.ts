import { DecodingError } from '../errors/decoding/decoding-error';
import { Result } from '../result/result';
import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';
export declare namespace PrimitiveReaders {
    class BooleanReader extends AbstractReader<boolean> implements Reader<boolean> {
        expectedType: Types.BooleanType;
        read(obj: any): Result<boolean, DecodingError>;
    }
    class StringReader extends AbstractReader<string> implements Reader<string> {
        expectedType: Types.StringType;
        read(obj: any): Result<string, DecodingError>;
    }
    class NumberReader extends AbstractReader<number> implements Reader<number> {
        expectedType: Types.NumberType;
        read(obj: any): Result<number, DecodingError>;
    }
}
