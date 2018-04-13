import * as errors from './errors/decoding/decoding-error';
import { Reader } from './readers/reader.interface';
import { OptionalReader } from './readers/abstract-reader';
import { PrimitiveReaders } from './readers/primitive-readers';
import { ArrayReader } from './readers/array-reader';
import { ExtractReader } from './readers/extract-reader';
import { EnumReader } from './readers/enum-reader';
import { EmptyObjectConstructor } from './readers/object-reader';
import { MapReader } from './readers/map-reader';
export { Reader } from './readers/reader.interface';
export { AbstractReader } from './readers/abstract-reader';
export { Types } from './jstypes';
export declare namespace TsJson {
    namespace Error {
        type DecodingError = errors.DecodingError;
    }
    const number: PrimitiveReaders.NumberReader;
    const string: PrimitiveReaders.StringReader;
    const boolean: PrimitiveReaders.BooleanReader;
    function optional<T>(reader: Reader<T>): OptionalReader<T>;
    function array<T>(reader: Reader<T>): ArrayReader<T>;
    function extract<T>(property: string, reader: Reader<T>): ExtractReader<T>;
    function enumeration(): EnumReader<never>;
    function map<T>(valueReader: Reader<T>): MapReader<T>;
    function obj(): EmptyObjectConstructor;
}
