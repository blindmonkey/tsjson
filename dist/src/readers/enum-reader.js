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
var jstypes_1 = require("../jstypes");
var EnumNoMatchError;
(function (EnumNoMatchError) {
    function create(values) {
        return {
            type: 'enum-no-match',
            validValues: values
        };
    }
    EnumNoMatchError.create = create;
})(EnumNoMatchError || (EnumNoMatchError = {}));
var EmptyEnumReader = /** @class */ (function () {
    function EmptyEnumReader() {
        this.expectedType = jstypes_1.Types.Union([]);
        this.expectedValues = [];
    }
    EmptyEnumReader.prototype.isEmpty = function () { return true; };
    EmptyEnumReader.prototype.case = function (s) {
        return new EnumValueReader(s, this);
    };
    EmptyEnumReader.prototype.read = function (obj) {
        if (typeof obj !== 'string') {
            var inferred = jstypes_1.Types.infer(obj);
            var typeString = inferred && jstypes_1.Types.toString(inferred) || 'Unknown';
            return result_1.Result.failure(errors.InvalidTypeError.create(obj, jstypes_1.Types.toString(jstypes_1.Types.String), typeString));
        }
        return result_1.Result.failure(EnumNoMatchError.create([]));
    };
    return EmptyEnumReader;
}());
var EnumValueReader = /** @class */ (function () {
    function EnumValueReader(value, baseReader) {
        this.value = value;
        this.baseReader = baseReader;
        this.expectedValues = baseReader.expectedValues.concat([value]);
    }
    EnumValueReader.prototype.isEmpty = function () { return false; };
    EnumValueReader.prototype.case = function (s) {
        return new EnumValueReader(s, this);
    };
    EnumValueReader.prototype.read = function (obj) {
        var _this = this;
        if (typeof obj !== 'string') {
            var inferred = jstypes_1.Types.infer(obj);
            var typeString = inferred && jstypes_1.Types.toString(inferred) || 'Unknown';
            return result_1.Result.failure(errors.InvalidTypeError.create(obj, jstypes_1.Types.toString(jstypes_1.Types.String), typeString));
        }
        if (obj === this.value) {
            return result_1.Result.success(this.value);
        }
        return this.baseReader.read(obj).mapFailure(function (failure) {
            if (failure.type === 'enum-no-match') {
                return EnumNoMatchError.create(failure.validValues.concat([_this.value]));
            }
            return failure;
        });
    };
    return EnumValueReader;
}());
var EnumReader = /** @class */ (function (_super) {
    __extends(EnumReader, _super);
    function EnumReader(base) {
        var _this = _super.call(this) || this;
        _this.base = base;
        _this.expectedType = jstypes_1.Types.Union(base.expectedValues.map(function (type) { return jstypes_1.Types.StringValue(type); }));
        return _this;
    }
    EnumReader.create = function () {
        return new EnumReader(new EmptyEnumReader());
    };
    EnumReader.prototype.case = function (s) {
        return new EnumReader(this.base.case(s));
    };
    EnumReader.prototype.read = function (obj) {
        var _this = this;
        return this.base.read(obj).mapFailure(function (failure) {
            if (failure.type === 'enum-no-match') {
                var inferred = jstypes_1.Types.infer(obj);
                var typeString = inferred && jstypes_1.Types.toString(inferred) || 'Unknown';
                return errors.InvalidTypeError.create(obj, jstypes_1.Types.toString(_this.expectedType), typeString);
            }
            return failure;
        });
    };
    return EnumReader;
}(abstract_reader_1.AbstractReader));
exports.EnumReader = EnumReader;
//# sourceMappingURL=enum-reader.js.map