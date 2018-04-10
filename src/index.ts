import * as errors from 'errors/decoding/decoding-error';

import { Reader } from 'readers/reader.interface';
import { OptionalReader } from 'readers/abstract-reader'
import { PrimitiveReaders } from 'readers/primitive-readers';
import { ArrayReader } from 'readers/array-reader';
import { ExtractReader } from 'readers/extract-reader';
import { EnumReader } from 'readers/enum-reader';
import { EmptyObjectConstructor } from 'readers/object-reader';


export namespace TsJson {
  export namespace Error {
    export type DecodingError = errors.DecodingError;
  }

  export const number = new PrimitiveReaders.NumberReader();
  export const string = new PrimitiveReaders.StringReader();
  export const boolean = new PrimitiveReaders.BooleanReader();

  export function optional<T>(reader: Reader<T>): OptionalReader<T> {
    return new OptionalReader(reader);
  }

  export function array<T>(reader: Reader<T>): ArrayReader<T> {
    return new ArrayReader<T>(reader);
  }

  export function extract<T>(property: string, reader: Reader<T>): ExtractReader<T> {
    return new ExtractReader(property, reader);
  }

  export function enumeration(): EnumReader<never> {
    return EnumReader.create();
  }

  export function obj(): EmptyObjectConstructor {
    return new EmptyObjectConstructor();
  }
}
