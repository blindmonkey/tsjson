"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors = __importStar(require("../errors/decoding/decoding-error"));
var result_1 = require("../result/result");
var abstract_reader_1 = require("./abstract-reader");
var extract_reader_1 = require("./extract-reader");
var jstypes_1 = require("../jstypes");
var EmptyObjectConstructor = /** @class */ (function (_super) {
    __extends(EmptyObjectConstructor, _super);
    function EmptyObjectConstructor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.expectedType = jstypes_1.Types.Object({});
        return _this;
    }
    // expectedTypes = {};
    EmptyObjectConstructor.prototype.isEmpty = function () { return true; };
    EmptyObjectConstructor.prototype.put = function (s, reader) {
        return new ObjectConstructor(s, reader, this);
    };
    EmptyObjectConstructor.prototype.prop = function (s, reader) {
        return new ObjectConstructor(s, new extract_reader_1.ExtractReader(s, reader), this);
    };
    EmptyObjectConstructor.prototype.read = function () {
        return result_1.Result.success({});
    };
    return EmptyObjectConstructor;
}(abstract_reader_1.AbstractReader));
exports.EmptyObjectConstructor = EmptyObjectConstructor;
var ObjectConstructor = /** @class */ (function () {
    function ObjectConstructor(property, reader, base) {
        // const baseExpectedTypes = base.expectedTypes;
        // const expectedTypes: {[k: string]: string} = {};
        // const expectedTypePairs: string[] = [];
        // for (var k in baseExpectedTypes) {
        //   if (Object.hasOwnProperty.call(baseExpectedTypes, k)) {
        //     const baseExpectedType = baseExpectedTypes[k];
        //     expectedTypes[k] = baseExpectedType;
        //     expectedTypePairs.push(Types.quoteAndEscape('"', k) + ': ' + baseExpectedType);
        //   }
        // }
        // expectedTypes[property] = reader.expectedType;
        // expectedTypePairs.push(Types.quoteAndEscape('"', property) + ': ' + reader.expectedType);
        // this.expectedTypes = expectedTypes;
        console.log('Combining', reader.expectedType, 'and', base.expectedType);
        var combinedType = jstypes_1.Types.combine(base.expectedType, reader.expectedType);
        console.log('Combined:', combinedType);
        if (combinedType == null) {
            throw Error('Unable to combine types: ' + base.expectedType.toString() + ' and ' + reader.expectedType.toString());
        }
        this.expectedType = combinedType; // ['{', expectedTypePairs.join(', '), '}'].join('');
        this.property = property;
        this.reader = reader;
        this.base = base;
    }
    ObjectConstructor.prototype.isEmpty = function () { return false; };
    ObjectConstructor.prototype.put = function (s, reader) {
        return new ObjectConstructor(s, reader, this);
    };
    ObjectConstructor.prototype.prop = function (s, reader) {
        return new ObjectConstructor(s, new extract_reader_1.ExtractReader(s, reader), this);
    };
    ObjectConstructor.prototype.read = function (obj) {
        var _this = this;
        return this.base.read(obj).flatMap(function (baseSuccess) {
            return _this.reader.read(obj).mapSuccess(function (success) {
                var successObj = baseSuccess;
                successObj[_this.property] = success;
                return successObj;
            });
        }, function (failure) {
            if (failure.type == 'invalid-type') {
                var inferred = jstypes_1.Types.infer(obj);
                var typeString = inferred && jstypes_1.Types.toString(inferred) || 'Unknown';
                return result_1.Result.failure(errors.InvalidTypeError.create(obj, jstypes_1.Types.toString(_this.expectedType), typeString, failure));
            }
            return result_1.Result.failure(failure);
        });
    };
    return ObjectConstructor;
}());
exports.ObjectConstructor = ObjectConstructor;
//# sourceMappingURL=object-reader.js.map