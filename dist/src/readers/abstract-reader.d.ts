import { DecodingError } from '../errors/decoding/decoding-error';
import { Result } from '../result/result';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';
export declare abstract class AbstractReader<T> implements Reader<T> {
    readonly Type: T;
    abstract expectedType: Types.Type;
    abstract read(obj: any): Result<T, DecodingError>;
    withDefault(value: T): DefaultReader<T>;
    asOptional(): OptionalReader<T>;
    or<S>(other: Reader<S>): OrReader<T, S>;
    map<S>(mapfn: (value: T) => S): MappingReader<T, S>;
}
export declare class DefaultReader<T> extends AbstractReader<T> implements Reader<T> {
    readonly Type: T;
    expectedType: Types.Type;
    private reader;
    private default;
    constructor(reader: Reader<T>, defaultValue: T);
    read(obj: any): Result<T, DecodingError>;
}
export declare class OrReader<A, B> extends AbstractReader<A | B> implements Reader<A | B> {
    readonly Type: A | B;
    expectedType: Types.Type;
    private readerA;
    private readerB;
    constructor(readerA: Reader<A>, readerB: Reader<B>);
    read(obj: any): Result<A | B, DecodingError>;
}
export declare class OptionalReader<T> extends DefaultReader<T | null> {
    readonly Type: T | null;
    constructor(reader: Reader<T>);
}
export declare class MappingReader<From, To> extends AbstractReader<To> {
    private reader;
    private mapfn;
    readonly Type: To;
    expectedType: Types.Type;
    constructor(reader: Reader<From>, mapfn: (value: From) => To);
    read(obj: any): Result<To, DecodingError>;
}
