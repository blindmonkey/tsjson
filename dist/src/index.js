"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_reader_1 = require("./readers/abstract-reader");
var primitive_readers_1 = require("./readers/primitive-readers");
var array_reader_1 = require("./readers/array-reader");
var extract_reader_1 = require("./readers/extract-reader");
var enum_reader_1 = require("./readers/enum-reader");
var object_reader_1 = require("./readers/object-reader");
var map_reader_1 = require("./readers/map-reader");
var abstract_reader_2 = require("./readers/abstract-reader");
exports.AbstractReader = abstract_reader_2.AbstractReader;
var jstypes_1 = require("./jstypes");
exports.Types = jstypes_1.Types;
var TsJson;
(function (TsJson) {
    TsJson.number = new primitive_readers_1.PrimitiveReaders.NumberReader();
    TsJson.string = new primitive_readers_1.PrimitiveReaders.StringReader();
    TsJson.boolean = new primitive_readers_1.PrimitiveReaders.BooleanReader();
    function optional(reader) {
        return new abstract_reader_1.OptionalReader(reader);
    }
    TsJson.optional = optional;
    function array(reader) {
        return new array_reader_1.ArrayReader(reader);
    }
    TsJson.array = array;
    function extract(property, reader) {
        return new extract_reader_1.ExtractReader(property, reader);
    }
    TsJson.extract = extract;
    function enumeration() {
        return enum_reader_1.EnumReader.create();
    }
    TsJson.enumeration = enumeration;
    function map(valueReader) {
        return new map_reader_1.MapReader(valueReader);
    }
    TsJson.map = map;
    function obj() {
        return new object_reader_1.EmptyObjectConstructor();
    }
    TsJson.obj = obj;
})(TsJson = exports.TsJson || (exports.TsJson = {}));
//# sourceMappingURL=index.js.map