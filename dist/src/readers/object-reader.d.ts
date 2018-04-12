import * as errors from 'errors/decoding/decoding-error';
import { Result } from 'result/result';
import { AbstractReader } from './abstract-reader';
import { Reader } from './reader.interface';
import { Types } from '../jstypes';
export interface ObjectConstructorInterface<T extends {}> extends Reader<T> {
    expectedType: Types.Type;
    isEmpty(): this is EmptyObjectConstructor;
    put<S extends string, U>(s: S & string, reader: Reader<U>): ObjectConstructorInterface<{
        [s in S]: U;
    } & T>;
    prop<S extends string, U>(s: S & string, reader: Reader<U>): ObjectConstructorInterface<{
        [s in S]: U;
    } & T>;
    read(obj: any): Result<T, errors.DecodingError>;
}
export declare class EmptyObjectConstructor extends AbstractReader<{}> implements ObjectConstructorInterface<{}> {
    expectedType: Types.ObjectType;
    isEmpty(): this is EmptyObjectConstructor;
    put<S extends string, U>(s: S, reader: Reader<U>): ObjectConstructorInterface<{
        [s in S]: U;
    } & {}>;
    prop<S extends string, U>(s: S, reader: Reader<U>): ObjectConstructorInterface<{
        [s in S]: U;
    } & {}>;
    read(): Result<{}, errors.DecodingError>;
}
export declare class ObjectConstructor<S extends string, U, Base> implements ObjectConstructorInterface<{
    [s in S]: U;
} & Base> {
    expectedType: Types.Type;
    private property;
    private reader;
    private base;
    constructor(property: S, reader: Reader<U>, base: ObjectConstructorInterface<Base>);
    isEmpty(): this is EmptyObjectConstructor;
    put<NewS extends string, NewU>(s: NewS, reader: Reader<NewU>): ObjectConstructorInterface<{
        [s in NewS]: NewU;
    } & {
        [s in S]: U;
    } & Base>;
    prop<NewS extends string, NewU>(s: NewS, reader: Reader<NewU>): ObjectConstructorInterface<{
        [s in NewS]: NewU;
    } & {
        [s in S]: U;
    } & Base>;
    read(obj: any): Result<{
        [s in S]: U;
    } & Base, errors.DecodingError>;
}
