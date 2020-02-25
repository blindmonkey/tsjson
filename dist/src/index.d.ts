import * as errors from './errors/decoding/decoding-error';
import { Reader } from './readers/reader.interface';
import { OptionalReader } from './readers/abstract-reader';
import { PrimitiveReaders } from './readers/primitive-readers';
import { ArrayReader } from './readers/array-reader';
import { ExtractReader } from './readers/extract-reader';
import { EnumReader } from './readers/enum-reader';
import { EmptyObjectConstructor } from './readers/object-reader';
import { MapReader } from './readers/map-reader';
import { AnyReader } from './readers/any-reader';
export { Reader } from './readers/reader.interface';
export { AbstractReader } from './readers/abstract-reader';
export { Types } from './jstypes';
export { Result } from './result/result';
export declare namespace TsJson {
    namespace Error {
        type DecodingError = errors.DecodingError;
    }
    type TypeOf<T extends Reader<any>> = T['Type'];
    const number: PrimitiveReaders.NumberReader;
    const string: PrimitiveReaders.StringReader;
    const boolean: PrimitiveReaders.BooleanReader;
    const anything: AnyReader;
    function optional<T>(reader: Reader<T>): OptionalReader<T>;
    function array<T>(reader: Reader<T>): ArrayReader<T>;
    function extract<T>(property: string, reader: Reader<T>): ExtractReader<T>;
    function enumeration(): EnumReader<never>;
    function map<T>(valueReader: Reader<T>): MapReader<T>;
    function obj(): EmptyObjectConstructor;
}
